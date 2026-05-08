#!/usr/bin/env node
/**
 * Reorganizacja folderu "App-własne(A)" w pasku zakładek Chrome (profil Default).
 *
 * - Backup pliku przed zmianą do c:/tmp/bookmarks-backup/<timestamp>/
 * - Sprawdza czy Chrome jest zamknięty (jeśli włączony — abort)
 * - Atomic write (tmp + rename)
 * - Po reorganizacji: 9 podfolderów + folder "Do usunięcia"
 *
 * Użycie:
 *   node reorganize-bookmarks.js [--dry-run]
 *
 * UWAGA: edycja pliku Chrome wymaga zamknięcia Chrome.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const HOME = os.homedir();
const CHROME_USER_DATA = path.join(HOME, 'AppData', 'Local', 'Google', 'Chrome', 'User Data');
const DEFAULT_PROFILE = path.join(CHROME_USER_DATA, 'Default');
const BOOKMARKS_FILE = path.join(DEFAULT_PROFILE, 'AccountBookmarks');
const BACKUP_ROOT = 'c:/tmp/bookmarks-backup';
const TARGET_FOLDER_NAME = 'App-własne(A)';

const DRY_RUN = process.argv.includes('--dry-run');

// === Definicja docelowej struktury ===
// Każdy podfolder ma listę URL-i (po URL identyfikujemy oryginalne wpisy by nie utracić date_added itd.)
// Plus 4 NOWE wpisy do dodania (z Profile 1 albo nowo wykryte).

const TARGET_STRUCTURE = [
  {
    name: '🎯 Codzienne CEO',
    items: [
      'https://raport-dnia-sporting.web.app/',
      'https://cockpit-sporting.web.app/',
      'https://hub-sporting.web.app/',
      'https://moja-tablica-kamishibai.web.app/',
      'https://ekosystem-sporting.web.app/#cyfrowe-narzdzia-firmy-co-mamy-i-co-dziki-temu-moemy',
    ],
  },
  {
    name: '🛒 Operacje / zespół',
    items: [
      { name: 'Marketing Sporting', url: 'https://marketing-sporting.web.app/', new: true },
      'https://kampanie-sporting.web.app/',
      'https://plakat-studio-sporting.web.app/',
      'https://grafik-sporting.web.app/',
      'https://kadry-sporting.web.app/',
    ],
  },
  {
    name: '📊 Analityka',
    items: [
      'https://financial-dash-sporting.web.app/',
      'https://inteligentne-zakupy.web.app/',
      'https://notebooklm.google.com/notebook/1d0fa892-2a05-490a-baa9-d9f50ba69b4a',
      'https://ekosystem-sporting.web.app/ceo#strona-8-bezpieczestwo-i-dane-wraliwe',
    ],
  },
  {
    name: '🔧 Procesy / Lean',
    items: [
      'https://zp.processapp.pl/dashboard',
      'https://sporting.processapp.io/ai',
      'https://sporting-dev.processapp.io/login',
      'https://leanboxsporting.web.app/',
    ],
  },
  {
    name: '📚 Szkolenia',
    items: [
      'https://sporting-onboarding-app.web.app/login',
      { name: 'sportingonboarding II', url: 'https://sporting-onboarding-v2.web.app/courses', new: true },
      { name: 'Szkolenia Sporting', url: 'https://szkolenia-sporting.web.app/', new: true },
      { name: 'Daily Learnings', url: 'https://daily-learnings-sporting.web.app/learn', new: true },
      'https://sporting-academy.web.app/',
      'https://linguaai-sporting.web.app/',
    ],
  },
  {
    name: '🎯 Rekrutacja',
    items: [
      'https://rekrutacja-sporting.web.app/admin',
      'https://rekrutacja-sporting.web.app/',
    ],
  },
  {
    name: '🛠️ Dev',
    items: [
      'https://github.com/andrzej-sporting',
      'https://sporting-project-wizard.web.app/',
      'https://improvements-andrzeja.web.app/',
    ],
  },
  {
    name: '📌 Specjalne',
    items: [
      'https://sporting-command-menu-36bfb.web.app/',
      'https://docs.google.com/spreadsheets/d/1BRWd7NtWC9kzfU6jA6QZHGmSHOIiLLMBylok73gPqQg/edit?gid=601677659#gid=601677659',
      'https://claude.ai/code/session_018wjRKvDHx426XBzcN7wrXv',
      'https://chess-coach-ag-2026.web.app/',
    ],
  },
  {
    name: '🗑️ Do usunięcia',
    items: [
      'file:///C:/Dev/Sporting-Source-of-Truth/ekosystem-sporting.html',
      'https://andrzej-notemap.web.app/',
      'file:///C:/Users/agold/Test%20Claude/chess.html',
      'https://github.com/andrzej-sporting/sporting-project-wizard/settings',
    ],
  },
];

// === Sprawdź czy Chrome działa ===
function isChromeRunning() {
  try {
    const out = execSync('tasklist /FI "IMAGENAME eq chrome.exe" /FO CSV /NH', { encoding: 'utf8' });
    return out.toLowerCase().includes('chrome.exe');
  } catch {
    return false;
  }
}

if (isChromeRunning()) {
  console.error('❌ Chrome jest uruchomiony. Zamknij Chrome przed reorganizacją.');
  console.error('   Powód: zmiany w pliku AccountBookmarks zostaną nadpisane przez Chrome.');
  process.exit(1);
}

// === Backup ===
function timestamp() {
  const d = new Date();
  return d.toISOString().replace(/[:.]/g, '-').replace('T', '_').slice(0, 19);
}
const backupDir = path.join(BACKUP_ROOT, timestamp() + '-reorg');
fs.mkdirSync(backupDir, { recursive: true });
fs.copyFileSync(BOOKMARKS_FILE, path.join(backupDir, 'Default-AccountBookmarks.json'));
console.log(`✅ Backup: ${backupDir}`);

// === Read ===
const raw = fs.readFileSync(BOOKMARKS_FILE, 'utf8');
let json;
try {
  json = JSON.parse(raw);
} catch (e) {
  console.error('❌ JSON niezgodny:', e.message);
  process.exit(1);
}

const bar = json.roots.bookmark_bar;
let appFolderIdx = bar.children.findIndex(c => c.name === TARGET_FOLDER_NAME);
if (appFolderIdx === -1) {
  console.error(`❌ Brak folderu "${TARGET_FOLDER_NAME}" w pasku zakładek`);
  process.exit(1);
}
const appFolder = bar.children[appFolderIdx];
console.log(`📁 Znaleziono "${TARGET_FOLDER_NAME}" — ${appFolder.children.length} wpisów (przed reorg)`);

// === Mapowanie URL → istniejący wpis (zachowuje date_added/id) ===
const urlToEntry = new Map();
for (const item of appFolder.children) {
  if (item.type === 'url') {
    urlToEntry.set(item.url, item);
  } else if (item.type === 'folder' && item.children) {
    for (const sub of item.children) {
      if (sub.type === 'url') urlToEntry.set(sub.url, sub);
    }
  }
}

// === Generowanie nowych ID dla folderów (max + 1) ===
function findMaxId(node, currentMax = { val: 0 }) {
  const id = parseInt(node.id) || 0;
  if (id > currentMax.val) currentMax.val = id;
  if (node.children) for (const c of node.children) findMaxId(c, currentMax);
  return currentMax.val;
}
let nextId = findMaxId(json.roots) + 1;
function newId() { return String(nextId++); }

// === Build new folder structure ===
function chromeNow() {
  // Chrome timestamp: microseconds since 1601-01-01
  const epochOffset = 11644473600000000n; // microseconds
  return String(BigInt(Date.now()) * 1000n + epochOffset);
}

const newChildren = [];
let kept = 0;
let added = 0;
let missing = [];

for (const section of TARGET_STRUCTURE) {
  const folder = {
    type: 'folder',
    id: newId(),
    name: section.name,
    date_added: chromeNow(),
    date_modified: chromeNow(),
    guid: require('crypto').randomUUID(),
    children: [],
  };
  for (const item of section.items) {
    let url, name, isNew = false;
    if (typeof item === 'string') {
      url = item;
    } else {
      url = item.url;
      name = item.name;
      isNew = item.new === true;
    }
    const existing = urlToEntry.get(url);
    if (existing) {
      folder.children.push(existing);
      kept++;
    } else if (isNew) {
      folder.children.push({
        type: 'url',
        id: newId(),
        name: name,
        url: url,
        date_added: chromeNow(),
        date_last_used: '0',
        guid: require('crypto').randomUUID(),
      });
      added++;
    } else {
      missing.push(url);
    }
  }
  newChildren.push(folder);
}

// === Zachowaj date_added oryginalnego folderu App-własne(A) ===
appFolder.children = newChildren;
appFolder.date_modified = chromeNow();

console.log(`📊 Reorg: ${kept} zachowanych + ${added} nowych. ${missing.length} nieznalezionych URL-i:`);
missing.forEach(u => console.log(`   ⚠️  ${u}`));

// === Sprawdź czy nie zgubiliśmy żadnego oryginalnego URL-a ===
const allTargetUrls = new Set();
for (const section of TARGET_STRUCTURE) {
  for (const item of section.items) {
    allTargetUrls.add(typeof item === 'string' ? item : item.url);
  }
}
const lostEntries = [];
for (const [url, entry] of urlToEntry) {
  if (!allTargetUrls.has(url)) {
    lostEntries.push({ url, name: entry.name });
  }
}
if (lostEntries.length > 0) {
  console.log(`\n⚠️  ${lostEntries.length} oryginalnych wpisów NIE jest w nowej strukturze (zostaną dodane do "🗑️ Do usunięcia"):`);
  lostEntries.forEach(e => console.log(`   • ${e.name} → ${e.url}`));
  // Dodaj do ostatniego folderu "Do usunięcia"
  const trash = newChildren[newChildren.length - 1];
  for (const e of lostEntries) {
    trash.children.push(urlToEntry.get(e.url));
  }
}

// === Atomic write ===
if (DRY_RUN) {
  console.log('\n🔍 DRY RUN — bez zapisu. Liczby finalne:');
  newChildren.forEach(f => console.log(`   ${f.name} — ${f.children.length}`));
  process.exit(0);
}

const tmpFile = BOOKMARKS_FILE + '.tmp';
fs.writeFileSync(tmpFile, JSON.stringify(json, null, 3), 'utf8');
// Walidacja JSON
try {
  JSON.parse(fs.readFileSync(tmpFile, 'utf8'));
} catch (e) {
  console.error('❌ Walidacja zapisanego JSON nieudana:', e.message);
  fs.unlinkSync(tmpFile);
  process.exit(1);
}
fs.renameSync(tmpFile, BOOKMARKS_FILE);

console.log('\n✅ Reorganizacja zakończona pomyślnie.');
console.log(`   Backup: ${backupDir}`);
console.log(`   Plik: ${BOOKMARKS_FILE}`);
console.log('\n📊 Nowa struktura:');
newChildren.forEach(f => console.log(`   ${f.name} — ${f.children.length}`));
