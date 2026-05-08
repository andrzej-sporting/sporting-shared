#!/usr/bin/env node
/**
 * Generuje plik HTML w formacie Netscape Bookmarks (importowalny do Chrome).
 * Struktura: 9 podfolderów wewnątrz "App-własne(A)" + 37 wpisów.
 *
 * Po wygenerowaniu CEO importuje przez Chrome Bookmarks Manager.
 * Chrome traktuje import jako lokalną zmianę → wepcha do konta Google → roznosi do innych profili.
 */

const fs = require('fs');

const STRUCTURE = [
  {
    name: '🎯 Codzienne CEO',
    items: [
      ['Raporty Dnia w Sporting (MyCoach)', 'https://raport-dnia-sporting.web.app/'],
      ['Sporting Cockpit', 'https://cockpit-sporting.web.app/'],
      ['Hub Sporting', 'https://hub-sporting.web.app/'],
      ['Tablica Kamishibai', 'https://moja-tablica-kamishibai.web.app/'],
      ['Ekosystem Sporting (zespół)', 'https://ekosystem-sporting.web.app/'],
    ],
  },
  {
    name: '🛒 Operacje / zespół',
    items: [
      ['Marketing Sporting', 'https://marketing-sporting.web.app/'],
      ['Sporting Kampanie', 'https://kampanie-sporting.web.app/'],
      ['Plakat Studio Sporting', 'https://plakat-studio-sporting.web.app/'],
      ['Grafik Sporting', 'https://grafik-sporting.web.app/'],
      ['Kadry Sporting', 'https://kadry-sporting.web.app/'],
    ],
  },
  {
    name: '📊 Analityka',
    items: [
      ['Financial Dashboard', 'https://financial-dash-sporting.web.app/'],
      ['AI Inteligentne Zakupy', 'https://inteligentne-zakupy.web.app/'],
      ['NotebookLM (GLS Financial)', 'https://notebooklm.google.com/notebook/1d0fa892-2a05-490a-baa9-d9f50ba69b4a'],
      ['Ekosystem Sporting CEO', 'https://ekosystem-sporting.web.app/ceo'],
    ],
  },
  {
    name: '🔧 Procesy / Lean',
    items: [
      ['Process App (główna)', 'https://zp.processapp.pl/dashboard'],
      ['Process App Marketing (Patryk)', 'https://sporting.processapp.io/ai'],
      ['Process App DEV', 'https://sporting-dev.processapp.io/login'],
      ['Sporting Lean Box', 'https://leanboxsporting.web.app/'],
    ],
  },
  {
    name: '📚 Szkolenia',
    items: [
      ['sportingonboarding', 'https://sporting-onboarding-app.web.app/login'],
      ['sportingonboarding II', 'https://sporting-onboarding-v2.web.app/courses'],
      ['Szkolenia Sporting', 'https://szkolenia-sporting.web.app/'],
      ['Daily Learnings', 'https://daily-learnings-sporting.web.app/learn'],
      ['Lean Sporting Academy', 'https://sporting-academy.web.app/'],
      ['LinguaAI', 'https://linguaai-sporting.web.app/'],
    ],
  },
  {
    name: '🎯 Rekrutacja',
    items: [
      ['Panel Rekrutacyjny - Admin', 'https://rekrutacja-sporting.web.app/admin'],
      ['Rekrutacja - Landing Page', 'https://rekrutacja-sporting.web.app/'],
    ],
  },
  {
    name: '🛠️ Dev',
    items: [
      ['GitHub - Repozytoria Andrzeja', 'https://github.com/andrzej-sporting'],
      ['Project Wizard | Sporting', 'https://sporting-project-wizard.web.app/'],
      ['Dziennik Usprawnień PRO', 'https://improvements-andrzeja.web.app/'],
    ],
  },
  {
    name: '📌 Specjalne',
    items: [
      ['Sporting Command Menu (poprzednik Hub)', 'https://sporting-command-menu-36bfb.web.app/'],
      ['Menu - Arkusze Google', 'https://docs.google.com/spreadsheets/d/1BRWd7NtWC9kzfU6jA6QZHGmSHOIiLLMBylok73gPqQg/edit?gid=601677659#gid=601677659'],
      ['Claude Code (od Patryka)', 'https://claude.ai/code/session_018wjRKvDHx426XBzcN7wrXv'],
      ['Chess Coach', 'https://chess-coach-ag-2026.web.app/'],
    ],
  },
  {
    name: '🗑️ Do usunięcia',
    items: [
      ['Ekosystem Sporting (file:///)', 'file:///C:/Dev/Sporting-Source-of-Truth/ekosystem-sporting.html'],
      ['NoteMap', 'https://andrzej-notemap.web.app/'],
      ['Szachy (file:///)', 'file:///C:/Users/agold/Test%20Claude/chess.html'],
      ['GitHub deep link /settings', 'https://github.com/andrzej-sporting/sporting-project-wizard/settings'],
    ],
  },
];

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const ts = Math.floor(Date.now() / 1000);

let html = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
    <DT><H3 ADD_DATE="${ts}" LAST_MODIFIED="${ts}" PERSONAL_TOOLBAR_FOLDER="true">Pasek zakładek</H3>
    <DL><p>
        <DT><H3 ADD_DATE="${ts}" LAST_MODIFIED="${ts}">App-własne(A) [ZORGANIZOWANE 08.05]</H3>
        <DL><p>
`;

for (const section of STRUCTURE) {
  html += `            <DT><H3 ADD_DATE="${ts}" LAST_MODIFIED="${ts}">${escapeHtml(section.name)}</H3>\n`;
  html += `            <DL><p>\n`;
  for (const [name, url] of section.items) {
    html += `                <DT><A HREF="${escapeHtml(url)}" ADD_DATE="${ts}">${escapeHtml(name)}</A>\n`;
  }
  html += `            </DL><p>\n`;
}

html += `        </DL><p>
    </DL><p>
</DL><p>
`;

const out = 'c:/tmp/App-wlasne-A-zorganizowane.html';
fs.writeFileSync(out, html, 'utf8');
console.log(`✅ Wygenerowano: ${out}`);
console.log(`   Zakładek: ${STRUCTURE.reduce((acc, s) => acc + s.items.length, 0)}`);
console.log(`   Folderów: ${STRUCTURE.length}`);
