import { getState, dispatch } from '../state.js';
import { renderTaskManager } from './task-view.js';
import { renderProjectManager } from './project-view.js';
import { renderCalendar } from './calendar-view.js';
import { renderSpreadsheet } from './spreadsheet-view.js';
import { renderEditor } from './editor-view.js';
import { renderTerminal } from './terminal-view.js';
import { renderFileManager } from './file-manager-view.js';
import { renderAnalytics } from './analytics-view.js';
import { renderSettings } from './settings-view.js';
import { renderNotifications } from './notifications-view.js';
import { renderDeveloperTools } from './settings-view.js';

const APPS = [
  { id: 'task-manager', title: 'Task Manager', icon: 'check-square', render: renderTaskManager },
  { id: 'project-manager', title: 'Project Manager', icon: 'folder', render: renderProjectManager },
  { id: 'calendar', title: 'Calendar', icon: 'calendar', render: renderCalendar },
  { id: 'spreadsheet', title: 'Spreadsheet', icon: 'grid', render: renderSpreadsheet },
  { id: 'editor', title: 'Text Editor', icon: 'file-text', render: renderEditor },
  { id: 'terminal', title: 'Terminal', icon: 'terminal', render: renderTerminal },
  { id: 'file-manager', title: 'File Manager', icon: 'hard-drive', render: renderFileManager },
  { id: 'analytics', title: 'Analytics', icon: 'bar-chart-2', render: renderAnalytics },
  { id: 'settings', title: 'Settings', icon: 'settings', render: renderSettings },
  { id: 'notifications', title: 'Notifications', icon: 'bell', render: renderNotifications },
  { id: 'developer-tools', title: 'Developer Tools', icon: 'cpu', render: renderDeveloperTools }
];

export function initShell() {
  renderDesktopIcons();
  setupTray();
  setupClock();
  subscribeState();
}

function renderDesktopIcons() {
  const grid = document.getElementById('app-grid');
  if (!grid) return;
  grid.innerHTML = APPS.map(app => `
    <div class="desktop-icon" data-id="${app.id}">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
      <span>${app.title}</span>
    </div>
  `).join('');
  grid.querySelectorAll('.desktop-icon').forEach(el => {
    el.addEventListener('dblclick', () => {
      const app = APPS.find(a => a.id === el.dataset.id);
      if (app) openWindow(app);
    });
  });
}

export function openWindow(app) {
  dispatch('OPEN_WINDOW', { id: app.id, title: app.title });
}

function setupTray() {
  const startBtn = document.getElementById('start-btn');
  const launcher = document.getElementById('launcher-menu');
  startBtn.addEventListener('click', () => launcher.classList.toggle('hidden'));
  launcher.addEventListener('click', e => { if (e.target === launcher) launcher.classList.add('hidden'); });

  const appsList = document.getElementById('launcher-apps-list');
  appsList.innerHTML = APPS.map(app => `<button class="tray-btn" data-id="${app.id}">${app.title}</button>`).join('');
  appsList.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      const app = APPS.find(a => a.id === btn.dataset.id);
      if (app) openWindow(app);
      launcher.classList.add('hidden');
    });
  });
}

function setupClock() {
  setInterval(() => {
    const clock = document.getElementById('system-clock');
    if (clock) clock.textContent = new Date().toLocaleTimeString();
  }, 1000);
}

function subscribeState() {
  import('../state.js').then(({ subscribe }) => {
    subscribe(state => {
      renderWindows(state.windows);
      renderTaskbar(state.windows);
    });
  });
}

function renderWindows(windows) {
  const container = document.getElementById('window-container');
  if (!container) return;
  container.innerHTML = windows.map(w => `
    <div class="window ${w.minimized ? 'minimized' : ''}" data-id="${w.id}" style="z-index: ${w.zIndex}; top: 50px; left: 50px; width: 600px; height: 400px;">
      <div class="window-header">
        <div class="window-title">${w.title}</div>
        <div class="window-controls">
          <button class="win-ctrl-btn minimize">_</button>
          <button class="win-ctrl-btn maximize">&#x25A1;</button>
          <button class="win-ctrl-btn close">X</button>
        </div>
      </div>
      <div class="window-body" id="body-${w.id}"></div>
    </div>
  `).join('');

  windows.forEach(w => {
    const winEl = container.querySelector(`[data-id="${w.id}"]`);
    const bodyEl = document.getElementById(`body-${w.id}`);
    const app = APPS.find(a => a.id === w.id);
    if (app && bodyEl && !bodyEl.hasChildNodes()) {
      app.render(bodyEl);
    }
    winEl.querySelector('.close').addEventListener('click', () => dispatch('CLOSE_WINDOW', w.id));
  });
}

function renderTaskbar(windows) {
  const taskbar = document.getElementById('shell-taskbar');
  if (!taskbar) return;
  taskbar.innerHTML = windows.map(w => `<div class="taskbar-item active">${w.title}</div>`).join('');
}