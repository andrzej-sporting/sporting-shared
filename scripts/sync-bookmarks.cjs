#!/usr/bin/env node
/**
 * Sync zakładek folderu "App-własne(A)" — Default → wszystkie pozostałe profile Chrome.
 *
 * Logika:
 * - Bierze folder "App-własne(A)" z profilu Default (źródło prawdy).
 * - Wstrzykuje go do każdego innego profilu Chrome (Profile 1, Profile 2, ...).
 * - Zachowuje WSZYSTKIE inne foldery / zakładki w docelowych profilach (BIBI, KINA, Banki itd.) — nietknięte.
 * - Jeśli docelowy profil NIE ma folderu "App-własne(A)" — dodaje na początku paska.
 * - Backup obu plików przed zmianą.
 * - Atomic write + walidacja JSON.
 * - Sprawdza czy Chrome jest zamknięty.
 *
 * Użycie:
 *   node sync-bookmarks.cjs            # sync na żywo
 *   node sync-bookmarks.cjs --dry-run  # tylko pokaż co by zrobił
 *   node sync-bookmarks.cjs --force    # nawet jeśli Chrome jest uruchomiony (NIE ZALECANE)
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const { execSync } = require('child_process');

const HOME = os.homedir();
const CHROME_USER_DATA = path.join(HOME, 'AppData', 'Local', 'Google', 'Chrome', 'User Data');
const SOURCE_PROFILE = 'Default';
const TARGET_FOLDER_NAME = 'App-własne(A)';
const BACKUP_ROOT = 'c:/tmp/bookmarks-backup';

const DRY_RUN = process.argv.includes('--dry-run');
const FORCE = process.argv.includes('--force');

function log(msg) {
  const t = new Date().toISOString().slice(0, 19).replace('T', ' ');
  console.log(`[${t}] ${msg}`);
}

function isChromeRunning() {
  try {
    const out = execSync('tasklist /FI "IMAGENAME eq chrome.exe" /FO CSV /NH', { encoding: 'utf8' });
    return out.toLowerCase().includes('chrome.exe');
  } catch {
    return false;
  }
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').slice(0, 19);
}

function readBookmarks(profilePath) {
  const file = path.join(profilePath, 'AccountBookmarks');
  if (!fs.existsSync(file)) return null;
  try {
    return { file, json: JSON.parse(fs.readFileSync(file, 'utf8')) };
  } catch (e) {
    log(`❌ Niezgodny JSON w ${file}: ${e.message}`);
    return null;
  }
}

function findAppFolder(json) {
  if (!json?.roots?.bookmark_bar?.children) return null;
  return json.roots.bookmark_bar.children.find(c => c.name === TARGET_FOLDER_NAME);
}

function regenerateGuids(node) {
  // Po skopiowaniu folderu do innego profilu — nadaj nowe guid-y, żeby Chrome traktował to jako lokalne wpisy.
  // Nie dotykamy oryginału (Default).
  if (node.guid) node.guid = crypto.randomUUID();
  if (node.children) {
    for (const c of node.children) regenerateGuids(c);
  }
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// === MAIN ===
log('🔁 Sync bookmarks — Default → wszystkie inne profile');

if (isChromeRunning() && !FORCE) {
  log('❌ Chrome jest uruchomiony. Zamknij Chrome lub użyj --force.');
  process.exit(1);
}

const sourcePath = path.join(CHROME_USER_DATA, SOURCE_PROFILE);
const source = readBookmarks(sourcePath);
if (!source) {
  log(`❌ Brak Default/AccountBookmarks lub niezgodny`);
  process.exit(1);
}
const sourceFolder = findAppFolder(source.json);
if (!sourceFolder) {
  log(`❌ Folder "${TARGET_FOLDER_NAME}" nie istnieje w Default`);
  process.exit(1);
}
log(`✅ Source (Default): folder "${TARGET_FOLDER_NAME}" — ${sourceFolder.children.length} elementów`);

// Znajdź wszystkie inne profile
const profiles = fs.readdirSync(CHROME_USER_DATA, { withFileTypes: true })
  .filter(d => d.isDirectory() && (d.name === 'Default' || d.name.startsWith('Profile ')))
  .filter(d => d.name !== SOURCE_PROFILE)
  .map(d => d.name);

if (profiles.length === 0) {
  log('ℹ️  Brak innych profili Chrome. Nic do zrobienia.');
  process.exit(0);
}
log(`📂 Znalezione inne profile: ${profiles.join(', ')}`);

// Backup wszystkiego przed zmianą
const backupDir = path.join(BACKUP_ROOT, timestamp() + '-sync');
fs.mkdirSync(backupDir, { recursive: true });
fs.copyFileSync(source.file, path.join(backupDir, 'Default-AccountBookmarks.json'));

let synced = 0;
let skipped = 0;

for (const profileName of profiles) {
  const profilePath = path.join(CHROME_USER_DATA, profileName);
  const target = readBookmarks(profilePath);
  if (!target) {
    log(`⏭️  Profile "${profileName}": brak AccountBookmarks (skip)`);
    skipped++;
    continue;
  }

  // Backup target
  fs.copyFileSync(target.file, path.join(backupDir, `${profileName.replace(/\s+/g, '_')}-AccountBookmarks.json`));

  // Klonuj source folder + nadaj nowe guid-y
  const newFolder = deepClone(sourceFolder);
  regenerateGuids(newFolder);

  // Znajdź lub dodaj folder w target
  const targetBar = target.json.roots.bookmark_bar;
  const existingIdx = targetBar.children.findIndex(c => c.name === TARGET_FOLDER_NAME);

  if (existingIdx >= 0) {
    // Zachowaj id istniejącego folderu (Chrome może go już cache-ować)
    newFolder.id = targetBar.children[existingIdx].id;
    newFolder.guid = targetBar.children[existingIdx].guid; // zachowujemy guid folderu, nie zawartości
    targetBar.children[existingIdx] = newFolder;
    log(`🔄 Profile "${profileName}": folder podmieniony (${newFolder.children.length} elementów)`);
  } else {
    targetBar.children.unshift(newFolder);
    log(`➕ Profile "${profileName}": folder dodany na początku paska (${newFolder.children.length} elementów)`);
  }

  if (DRY_RUN) {
    log(`   [dry-run] ${target.file} NIE zapisany`);
    synced++;
    continue;
  }

  // Atomic write
  const tmp = target.file + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(target.json, null, 3), 'utf8');
  try {
    JSON.parse(fs.readFileSync(tmp, 'utf8'));
  } catch (e) {
    log(`❌ Walidacja zapisu nieudana dla ${profileName}: ${e.message}`);
    fs.unlinkSync(tmp);
    skipped++;
    continue;
  }
  fs.renameSync(tmp, target.file);
  synced++;
}

log(`\n✅ Zakończono: ${synced} zsynchronizowanych, ${skipped} pominięte`);
log(`   Backup: ${backupDir}`);
if (DRY_RUN) log('   (DRY RUN — nic nie zapisane)');
