/**
 * NEXUS OS — Main Application Logic
 */

const STORAGE_KEY = 'nexus_os_data_v1';
const MAX_HISTORY = 20;

let state = {
  tasks: [],
  settings: {
    theme: 'dark',
    layout: 'comfortable',
    animations: 'on'
  },
  history: [],
  redoStack: []
};

// DOM Elements Cache
const DOM = {
  views: document.querySelectorAll('.view'),
  navItems: document.querySelectorAll('.nav-item'),
  pageTitle: document.getElementById('page-title'),
  sidebarToggle: document.getElementById('sidebar-toggle'),
  sidebar: document.querySelector('.sidebar'),
  themeToggle: document.getElementById('theme-toggle'),
  quickAddBtn: document.getElementById('quick-add-btn'),
  addTaskBtn: document.getElementById('add-task-btn'),
  taskModal: document.getElementById('task-modal'),
  taskForm: document.getElementById('task-form'),
  taskModalTitle: document.getElementById('task-modal-title'),
  taskCancelBtn: document.getElementById('task-cancel-btn'),
  taskId: document.getElementById('task-id'),
  taskTitle: document.getElementById('task-title'),
  taskDesc: document.getElementById('task-desc'),
  taskPriority: document.getElementById('task-priority'),
  taskStatus: document.getElementById('task-status'),
  taskDeadline: document.getElementById('task-deadline'),
  taskSearch: document.getElementById('task-search'),
  filterStatus: document.getElementById('filter-status'),
  filterPriority: document.getElementById('filter-priority'),
  sortBy: document.getElementById('sort-by'),
  commandPalette: document.getElementById('command-palette'),
  commandInput: document.getElementById('command-input'),
  commandResults: document.getElementById('command-results'),
  confirmModal: document.getElementById('confirm-modal'),
  confirmTitle: document.getElementById('confirm-title'),
  confirmMessage: document.getElementById('confirm-message'),
  confirmYesBtn: document.getElementById('confirm-yes-btn'),
  confirmNoBtn: document.getElementById('confirm-no-btn'),
  toastContainer: document.getElementById('toast-container'),
  exportBtn: document.getElementById('export-btn'),
  importFile: document.getElementById('import-file'),
  clearAllBtn: document.getElementById('clear-all-btn'),
  settingsThemeBtn: document.getElementById('settings-theme-btn'),
  settingsLayout: document.getElementById('settings-layout'),
  settingsAnimation: document.getElementById('settings-animation')
};

let confirmCallback = null;

// Initialize App
function init() {
  loadState();
  applySettings();
  setupEventListeners();
  renderAll();
  registerServiceWorker();
}

// LocalStorage Management
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.tasks) state.tasks = parsed.tasks;
      if (parsed.settings) state.settings = { ...state.settings, ...parsed.settings };
    } else {
      // Seed initial demo tasks if empty
      state.tasks = [
        { id: '1', title: 'Welcome to NEXUS OS', description: 'Explore dashboard, Kanban, and command palette.', status: 'done', priority: 'high', deadline: new Date().toISOString().split('T')[0] },
        { id: '2', title: 'Setup project workflow', description: 'Define tasks and collaborate with team members.', status: 'in-progress', priority: 'medium', deadline: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0] },
        { id: '3', title: 'Review analytics & reports', description: 'Check productivity metrics and completed counts.', status: 'todo', priority: 'low', deadline: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0] }
      ];
      saveState(false);
    }
  } catch (err) {
    console.error('Failed to load state from localStorage:', err);
    showToast('Error loading saved data.', 'error');
  }
}

function saveState(recordHistory = true) {
  if (recordHistory) {
    pushHistory();
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      tasks: state.tasks,
      settings: state.settings
    }));
  } catch (err) {
    console.error('Failed to save state:', err);
    showToast('Storage quota exceeded or error.', 'error');
  }
  renderAll();
}

// History for Undo / Redo
function pushHistory() {
  state.history.push(JSON.stringify(state.tasks));
  if (state.history.length > MAX_HISTORY) {
    state.history.shift();
  }
  state.redoStack = [];
}

function undo() {
  if (state.history.length === 0) {
    showToast('Nothing to undo.', 'error');
    return;
  }
  state.redoStack.push(JSON.stringify(state.tasks));
  const prev = state.history.pop();
  state.tasks = JSON.parse(prev);
  saveState(false);
  showToast('Undo successful.', 'success');
}

function redo() {
  if (state.redoStack.length === 0) {
    showToast('Nothing to redo.', 'error');
    return;
  }
  state.history.push(JSON.stringify(state.tasks));
  const next = state.redoStack.pop();
  state.tasks = JSON.parse(next);
  saveState(false);
  showToast('Redo successful.', 'success');
}

// UI Rendering
function renderAll() {
  renderDashboard();
  renderTasks();
  renderAnalytics();
  syncSettingsUI();
}

function renderDashboard() {
  const total = state.tasks.length;
  const inProgress = state.tasks.filter(t => t.status === 'in-progress').length;
  const completed = state.tasks.filter(t => t.status === 'done').length;
  const todayStr = new Date().toISOString().split('T')[0];
  const overdue = state.tasks.filter(t => t.deadline && t.deadline < todayStr && t.status !== 'done').length;

  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-in-progress').textContent = inProgress;
  document.getElementById('stat-completed').textContent = completed;
  document.getElementById('stat-overdue').textContent = overdue;

  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
  document.getElementById('overall-progress-bar').style.width = pct + '%';
  document.getElementById('overall-progress-text').textContent = pct + '% Completed';

  // Recent high priority
  const recentHigh = state.tasks.filter(t => t.priority === 'high' && t.status !== 'done').slice(0, 5);
  const recentListEl = document.getElementById('recent-tasks-list');
  recentListEl.innerHTML = '';
  if (recentHigh.length === 0) {
    recentListEl.innerHTML = '<p style="color: var(--text-secondary); font-size: 0.9rem;">No high priority pending tasks.</p>';
  } else {
    recentHigh.forEach(t => {
      const div = document.createElement('div');
      div.className = 'compact-item';
      div.innerHTML = `<span><strong>${escapeHtml(t.title)}</strong></span><span class="badge badge-high">High</span>`;
      recentListEl.appendChild(div);
    });
  }
}

function renderTasks() {
  const search = DOM.taskSearch.value.toLowerCase();
  const fStatus = DOM.filterStatus.value;
  const fPriority = DOM.filterPriority.value;
  const sortBy = DOM.sortBy.value;

  let filtered = state.tasks.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search) || (t.description && t.description.toLowerCase().includes(search));
    const matchStatus = fStatus === 'all' || t.status === fStatus;
    const matchPriority = fPriority === 'all' || t.priority === fPriority;
    return matchSearch && matchStatus && matchPriority;
  });

  // Sort
  filtered.sort((a, b) => {
    if (sortBy === 'deadline-asc') {
      return (a.deadline || '9999-99-99').localeCompare(b.deadline || '9999-99-99');
    } else if (sortBy === 'deadline-desc') {
      return (b.deadline || '').localeCompare(a.deadline || '');
    } else if (sortBy === 'priority-desc') {
      const pMap = { high: 3, medium: 2, low: 1 };
      return pMap[b.priority] - pMap[a.priority];
    } else if (sortBy === 'title-asc') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  // Clear dropzones
  const zones = {
    todo: document.getElementById('dropzone-todo'),
    'in-progress': document.getElementById('dropzone-in-progress'),
    done: document.getElementById('dropzone-done')
  };
  Object.values(zones).forEach(z => z.innerHTML = '');

  const counts = { todo: 0, 'in-progress': 0, done: 0 };

  filtered.forEach(t => {
    counts[t.status]++;
    const card = createTaskCard(t);
    if (zones[t.status]) {
      zones[t.status].appendChild(card);
    }
  });

  document.getElementById('count-todo').textContent = counts.todo;
  document.getElementById('count-in-progress').textContent = counts['in-progress'];
  document.getElementById('count-done').textContent = counts.done;
}

function createTaskCard(t) {
  const card = document.createElement('div');
  card.className = 'task-card';
  card.draggable = true;
  card.dataset.id = t.id;

  card.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', t.id);
    card.classList.add('dragging');
  });
  card.addEventListener('dragend', () => {
    card.classList.remove('dragging');
  });

  card.innerHTML = `
    <div class="task-card-header">
      <span class="task-card-title">${escapeHtml(t.title)}</span>
      <span class="badge badge-${t.priority}">${t.priority}</span>
    </div>
    ${t.description ? `<div class="task-card-desc">${escapeHtml(t.description)}</div>` : ''}
    <div class="task-card-footer">
      <span>📅 ${t.deadline || 'No deadline'}</span>
      <div class="task-actions-menu">
        <button class="task-action-btn" onclick="editTask('${t.id}')" title="Edit">✏️</button>
        <button class="task-action-btn" onclick="deleteTask('${t.id}')" title="Delete">🗑️</button>
      </div>
    </div>
  `;
  return card;
}

function renderAnalytics() {
  const total = state.tasks.length;
  const completed = state.tasks.filter(t => t.status === 'done').length;
  const highPending = state.tasks.filter(t => t.priority === 'high' && t.status !== 'done').length;

  document.getElementById('metric-completion-rate').textContent = (total === 0 ? 0 : Math.round((completed / total) * 100)) + '%';
  document.getElementById('metric-high-pending').textContent = highPending;
  document.getElementById('metric-active').textContent = state.tasks.filter(t => t.status !== 'done').length;

  // Status chart
  const statusCounts = {
    todo: state.tasks.filter(t => t.status === 'todo').length,
    'in-progress': state.tasks.filter(t => t.status === 'in-progress').length,
    done: state.tasks.filter(t => t.status === 'done').length
  };
  const chartStatus = document.getElementById('chart-status');
  chartStatus.innerHTML = `
    <div class="chart-row"><span class="chart-label">Todo</span><div class="chart-bar-wrapper"><div class="chart-bar" style="width: ${total ? (statusCounts.todo/total)*100 : 0}%"></div></div><span class="chart-val">${statusCounts.todo}</span></div>
    <div class="chart-row"><span class="chart-label">In Progress</span><div class="chart-bar-wrapper"><div class="chart-bar" style="width: ${total ? (statusCounts['in-progress']/total)*100 : 0}%"></div></div><span class="chart-val">${statusCounts['in-progress']}</span></div>
    <div class="chart-row"><span class="chart-label">Done</span><div class="chart-bar-wrapper"><div class="chart-bar" style="width: ${total ? (statusCounts.done/total)*100 : 0}%"></div></div><span class="chart-val">${statusCounts.done}</span></div>
  `;

  // Priority chart
  const priorityCounts = {
    high: state.tasks.filter(t => t.priority === 'high').length,
    medium: state.tasks.filter(t => t.priority === 'medium').length,
    low: state.tasks.filter(t => t.priority === 'low').length
  };
  const chartPriority = document.getElementById('chart-priority');
  chartPriority.innerHTML = `
    <div class="chart-row"><span class="chart-label">High</span><div class="chart-bar-wrapper"><div class="chart-bar" style="width: ${total ? (priorityCounts.high/total)*100 : 0}%; background-color: var(--danger);"></div></div><span class="chart-val">${priorityCounts.high}</span></div>
    <div class="chart-row"><span class="chart-label">Medium</span><div class="chart-bar-wrapper"><div class="chart-bar" style="width: ${total ? (priorityCounts.medium/total)*100 : 0}%; background-color: var(--warning);"></div></div><span class="chart-val">${priorityCounts.medium}</span></div>
    <div class="chart-row"><span class="chart-label">Low</span><div class="chart-bar-wrapper"><div class="chart-bar" style="width: ${total ? (priorityCounts.low/total)*100 : 0}%; background-color: var(--info);"></div></div><span class="chart-val">${priorityCounts.low}</span></div>
  `;
}

// Settings Management
function applySettings() {
  document.documentElement.setAttribute('data-theme', state.settings.theme);
  document.documentElement.setAttribute('data-layout', state.settings.layout);
  document.documentElement.setAttribute('data-animations', state.settings.animations);
  DOM.themeToggle.textContent = state.settings.theme === 'dark' ? '🌙' : '☀️';
}

function syncSettingsUI() {
  DOM.settingsLayout.value = state.settings.layout;
  DOM.settingsAnimation.value = state.settings.animations;
}

function toggleTheme() {
  state.settings.theme = state.settings.theme === 'dark' ? 'light' : 'dark';
  applySettings();
  saveState(false);
  showToast(`Switched to ${state.settings.theme} mode.`, 'success');
}

// Navigation Views
function switchView(viewName) {
  DOM.views.forEach(v => v.classList.remove('active'));
  DOM.navItems.forEach(n => n.classList.remove('active'));

  const targetView = document.getElementById(`view-${viewName}`);
  const targetNav = document.querySelector(`.nav-item[data-view="${viewName}"]`);

  if (targetView) targetView.classList.add('active');
  if (targetNav) targetNav.classList.add('active');

  DOM.pageTitle.textContent = viewName.charAt(0).toUpperCase() + viewName.slice(1);
  DOM.sidebar.classList.remove('mobile-open');
}

// Task Modal & CRUD
function openTaskModal(taskId = null) {
  DOM.taskForm.reset();
  if (taskId) {
    const task = state.tasks.find(t => t.id === taskId);
    if (task) {
      DOM.taskModalTitle.textContent = 'Edit Task';
      DOM.taskId.value = task.id;
      DOM.taskTitle.value = task.title;
      DOM.taskDesc.value = task.description || '';
      DOM.taskPriority.value = task.priority;
      DOM.taskStatus.value = task.status;
      DOM.taskDeadline.value = task.deadline || '';
    }
  } else {
    DOM.taskModalTitle.textContent = 'Create New Task';
    DOM.taskId.value = '';
    DOM.taskDeadline.value = new Date().toISOString().split('T')[0];
  }
  DOM.taskModal.style.display = 'flex';
  DOM.taskModal.setAttribute('aria-hidden', 'false');
  DOM.taskTitle.focus();
}

function closeTaskModal() {
  DOM.taskModal.style.display = 'none';
  DOM.taskModal.setAttribute('aria-hidden', 'true');
}

window.editTask = function(id) {
  openTaskModal(id);
};

window.deleteTask = function(id) {
  showConfirm('Delete Task', 'Are you sure you want to delete this task?', () => {
    state.tasks = state.tasks.filter(t => t.id !== id);
    saveState(true);
    showToast('Task deleted.', 'success');
  });
};

// Event Listeners setup
function setupEventListeners() {
  // Navigation
  DOM.navItems.forEach(item => {
    item.addEventListener('click', () => {
      switchView(item.dataset.view);
    });
  });

  DOM.sidebarToggle.addEventListener('click', () => {
    DOM.sidebar.classList.toggle('mobile-open');
  });

  DOM.themeToggle.addEventListener('click', toggleTheme);
  DOM.settingsThemeBtn.addEventListener('click', toggleTheme);

  // Task modals
  DOM.quickAddBtn.addEventListener('click', () => openTaskModal());
  DOM.addTaskBtn.addEventListener('click', () => openTaskModal());
  DOM.taskCancelBtn.addEventListener('click', closeTaskModal);

  DOM.taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = DOM.taskId.value;
    const title = DOM.taskTitle.value.trim();
    const description = DOM.taskDesc.value.trim();
    const priority = DOM.taskPriority.value;
    const status = DOM.taskStatus.value;
    const deadline = DOM.taskDeadline.value;

    if (!title) {
      showToast('Task title cannot be empty.', 'error');
      return;
    }

    if (id) {
      // Edit
      state.tasks = state.tasks.map(t => t.id === id ? { ...t, title, description, priority, status, deadline } : t);
      showToast('Task updated successfully.', 'success');
    } else {
      // Create
      const newTask = {
        id: 't_' + Date.now() + Math.random().toString(36).substr(2, 4),
        title,
        description,
        priority,
        status,
        deadline
      };
      state.tasks.push(newTask);
      showToast('Task created successfully.', 'success');
    }

    closeTaskModal();
    saveState(true);
  });

  // Filters & Search
  DOM.taskSearch.addEventListener('input', renderTasks);
  DOM.filterStatus.addEventListener('change', renderTasks);
  DOM.filterPriority.addEventListener('change', renderTasks);
  DOM.sortBy.addEventListener('change', renderTasks);

  // Drag and Drop
  document.querySelectorAll('.kanban-column').forEach(col => {
    const dropzone = col.querySelector('.task-dropzone');
    const status = col.dataset.status;

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      const taskId = e.dataTransfer.getData('text/plain');
      if (taskId) {
        const task = state.tasks.find(t => t.id === taskId);
        if (task && task.status !== status) {
          task.status = status;
          saveState(true);
          showToast(`Task moved to ${status}.`, 'success');
        }
      }
    });
  });

  // Settings changes
  DOM.settingsLayout.addEventListener('change', (e) => {
    state.settings.layout = e.target.value;
    applySettings();
    saveState(false);
  });

  DOM.settingsAnimation.addEventListener('change', (e) => {
    state.settings.animations = e.target.value;
    applySettings();
    saveState(false);
  });

  // Export / Import
  DOM.exportBtn.addEventListener('click', exportData);
  DOM.importFile.addEventListener('change', importData);

  // Clear All
  DOM.clearAllBtn.addEventListener('click', () => {
    showConfirm('Clear All Tasks', 'Are you sure you want to delete all tasks? This action cannot be undone easily.', () => {
      state.tasks = [];
      saveState(true);
      showToast('All tasks cleared.', 'success');
    });
  });

  // Keyboard Shortcuts (Ctrl+K, Ctrl+Z, Ctrl+Y, ESC)
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openCommandPalette();
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      undo();
    } else if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))) {
      e.preventDefault();
      redo();
    } else if (e.key === 'Escape') {
      closeCommandPalette();
      closeTaskModal();
      closeConfirmModal();
    }
  });

  // Command Palette input
  DOM.commandInput.addEventListener('input', updateCommandResults);
  DOM.commandPalette.addEventListener('click', (e) => {
    if (e.target === DOM.commandPalette) closeCommandPalette();
  });
}

// Command Palette
function openCommandPalette() {
  DOM.commandPalette.style.display = 'flex';
  DOM.commandPalette.setAttribute('aria-hidden', 'false');
  DOM.commandInput.value = '';
  updateCommandResults();
  DOM.commandInput.focus();
}

function closeCommandPalette() {
  DOM.commandPalette.style.display = 'none';
  DOM.commandPalette.setAttribute('aria-hidden', 'true');
}

function updateCommandResults() {
  const query = DOM.commandInput.value.toLowerCase();
  const commands = [
    { label: 'Create new task', action: () => { closeCommandPalette(); openTaskModal(); } },
    { label: 'Go to Dashboard', action: () => { closeCommandPalette(); switchView('dashboard'); } },
    { label: 'Go to Tasks (Kanban)', action: () => { closeCommandPalette(); switchView('tasks'); } },
    { label: 'Go to Analytics', action: () => { closeCommandPalette(); switchView('analytics'); } },
    { label: 'Go to Settings', action: () => { closeCommandPalette(); switchView('settings'); } },
    { label: 'Toggle Theme (Dark/Light)', action: () => { closeCommandPalette(); toggleTheme(); } },
    { label: 'Export Data JSON', action: () => { closeCommandPalette(); exportData(); } },
    { label: 'Clear Completed Tasks', action: () => {
      closeCommandPalette();
      showConfirm('Clear Completed', 'Delete all completed tasks?', () => {
        state.tasks = state.tasks.filter(t => t.status !== 'done');
        saveState(true);
        showToast('Completed tasks cleared.', 'success');
      });
    }}
  ];

  const matched = commands.filter(c => c.label.toLowerCase().includes(query));
  DOM.commandResults.innerHTML = '';

  if (matched.length === 0) {
    DOM.commandResults.innerHTML = '<div class="command-item" style="color: var(--text-secondary);">No matching commands found.</div>';
    return;
  }

  matched.forEach(cmd => {
    const div = document.createElement('div');
    div.className = 'command-item';
    div.textContent = cmd.label;
    div.addEventListener('click', cmd.action);
    DOM.commandResults.appendChild(div);
  });
}

// Import / Export
function exportData() {
  try {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      tasks: state.tasks,
      settings: state.settings
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `nexus_os_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Data exported successfully.', 'success');
  } catch (err) {
    console.error('Export failed:', err);
    showToast('Export failed.', 'error');
  }
}

function importData(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(event) {
    try {
      const parsed = JSON.parse(event.target.result);
      if (!parsed || !Array.isArray(parsed.tasks)) {
        throw new Error('Invalid JSON structure. Missing tasks array.');
      }
      state.tasks = parsed.tasks;
      if (parsed.settings) {
        state.settings = { ...state.settings, ...parsed.settings };
      }
      applySettings();
      saveState(true);
      showToast('Data imported successfully.', 'success');
    } catch (err) {
      console.error('Import parse error:', err);
      showToast('Invalid JSON file format. Could not import.', 'error');
    } finally {
      DOM.importFile.value = '';
    }
  };
  reader.readAsText(file);
}

// Confirmation Modal
function showConfirm(title, message, onConfirm) {
  DOM.confirmTitle.textContent = title;
  DOM.confirmMessage.textContent = message;
  confirmCallback = onConfirm;
  DOM.confirmModal.style.display = 'flex';
  DOM.confirmModal.setAttribute('aria-hidden', 'false');
}

function closeConfirmModal() {
  DOM.confirmModal.style.display = 'none';
  DOM.confirmModal.setAttribute('aria-hidden', 'true');
  confirmCallback = null;
}

DOM.confirmYesBtn.addEventListener('click', () => {
  if (typeof confirmCallback === 'function') {
    confirmCallback();
  }
  closeConfirmModal();
});

DOM.confirmNoBtn.addEventListener('click', closeConfirmModal);
DOM.confirmModal.addEventListener('click', (e) => {
  if (e.target === DOM.confirmModal) closeConfirmModal();
});

// Toasts
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  DOM.toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Utilities
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>'"/]/g, s => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
    '/': '&#x2F;'
  }[s]));
}

// PWA Service Worker Registration
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
      .then(() => console.log('Service Worker registered successfully.'))
      .catch(err => console.warn('Service Worker registration failed:', err));
  }
}

// Run on load
document.addEventListener('DOMContentLoaded', init);