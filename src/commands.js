import { dispatch } from './state.js';

export const commands = [
  { id: 'create_task', name: 'Create Task', action: () => dispatch('OPEN_WINDOW', { id: 'task-manager', title: 'Task Manager' }) },
  { id: 'create_project', name: 'Create Project', action: () => dispatch('OPEN_WINDOW', { id: 'project-manager', title: 'Project Manager' }) },
  { id: 'open_calendar', name: 'Open Calendar', action: () => dispatch('OPEN_WINDOW', { id: 'calendar', title: 'Calendar' }) },
  { id: 'open_spreadsheet', name: 'Open Spreadsheet', action: () => dispatch('OPEN_WINDOW', { id: 'spreadsheet', title: 'Spreadsheet' }) },
  { id: 'open_editor', name: 'Open Text Editor', action: () => dispatch('OPEN_WINDOW', { id: 'editor', title: 'Text Editor' }) },
  { id: 'open_terminal', name: 'Open Terminal', action: () => dispatch('OPEN_WINDOW', { id: 'terminal', title: 'Terminal' }) },
  { id: 'open_files', name: 'Open File Manager', action: () => dispatch('OPEN_WINDOW', { id: 'file-manager', title: 'File Manager' }) },
  { id: 'open_analytics', name: 'Open Analytics', action: () => dispatch('OPEN_WINDOW', { id: 'analytics', title: 'Analytics' }) },
  { id: 'open_settings', name: 'Open Settings', action: () => dispatch('OPEN_WINDOW', { id: 'settings', title: 'Settings' }) },
  { id: 'open_notifications', name: 'Open Notifications', action: () => dispatch('OPEN_WINDOW', { id: 'notifications', title: 'Notifications' }) },
  { id: 'open_search', name: 'Open Search', action: () => dispatch('OPEN_WINDOW', { id: 'search', title: 'Global Search' }) },
  { id: 'developer_tools', name: 'Open Developer Tools', action: () => dispatch('OPEN_WINDOW', { id: 'developer-tools', title: 'Developer Tools' }) },
  { id: 'toggle_theme', name: 'Toggle Theme', action: () => { const s = getState(); dispatch('UPDATE_SETTINGS', { theme: s.settings.theme === 'dark' ? 'light' : 'dark' }); } },
  { id: 'toggle_compact', name: 'Toggle Compact Mode', action: () => {} },
  { id: 'export_data', name: 'Export Data', action: () => {} },
  { id: 'import_data', name: 'Import Data', action: () => {} },
  { id: 'backup_data', name: 'Backup Data', action: () => {} },
  { id: 'restore_data', name: 'Restore Data', action: () => {} },
  { id: 'undo', name: 'Undo', action: () => {} },
  { id: 'redo', name: 'Redo', action: () => {} },
  { id: 'search', name: 'Global Search', action: () => {} },
  { id: 'lock_app', name: 'Lock App', action: () => dispatch('TOGGLE_LOCK') },
  { id: 'developer_mode', name: 'Developer Mode', action: () => {} },
  { id: 'run_tests', name: 'Run Self Tests', action: () => dispatch('OPEN_WINDOW', { id: 'developer-tools', title: 'Developer Tools' }) },
  { id: 'generate_data', name: 'Generate Test Data', action: () => {} },
  { id: 'clear_notifications', name: 'Clear Notifications', action: () => dispatch('CLEAR_NOTIFICATIONS') },
  { id: 'clear_cache', name: 'Clear Cache', action: () => localStorage.clear() },
  { id: 'reset_settings', name: 'Reset Settings', action: () => {} },
  { id: 'reset_database', name: 'Reset Database', action: () => indexedDB.deleteDatabase('OmegaDesktopDB') },
  { id: 'open_shortcuts', name: 'Open Shortcuts', action: () => {} },
  { id: 'open_about', name: 'Open About Omega', action: () => alert('OMEGA DESKTOP v1.0.0 — Torture Test OS') },
  { id: 'open_activity', name: 'Open Activity Log', action: () => {} },
  { id: 'open_help', name: 'Open Help', action: () => alert('Press Ctrl+K to open Command Palette.') }
];

import { getState } from './state.js';

export function initCommands() {
  const paletteInput = document.getElementById('palette-input');
  const paletteResults = document.getElementById('palette-results');
  if (!paletteInput || !paletteResults) return;
  
  paletteInput.addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    const filtered = commands.filter(c => c.name.toLowerCase().includes(q));
    paletteResults.innerHTML = filtered.map(c => `<div class="palette-item" data-id="${c.id}" style="padding:8px;cursor:pointer;">${c.name}</div>`).join('');
    paletteResults.querySelectorAll('.palette-item').forEach(el => {
      el.addEventListener('click', () => {
        const cmd = commands.find(c => c.id === el.dataset.id);
        if (cmd) cmd.action();
        document.getElementById('command-palette').classList.add('hidden');
      });
    });
  });
}