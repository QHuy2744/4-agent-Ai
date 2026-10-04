/**
 * app.js - Main Bootstrap, UI Coordinator, and Global Error Handling.
 */
class UIManager {
  constructor() {
    this.currentView = 'dashboard';
  }

  async init() {
    window.onerror = (msg, url, line) => {
      console.error('Global Error:', msg, url, line);
      this.showToast(`Error: ${msg}`, 'error');
    };

    window.addEventListener('unhandledrejection', event => {
      console.error('Unhandled Promise Rejection:', event.reason);
      this.showToast(`Error: ${event.reason.message || event.reason}`, 'error');
    });

    await window.storageEngine.init();
    await window.stateManager.loadState();

    window.stateManager.subscribe(() => this.render());
    this.setupListeners();
    this.render();

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('service-worker.js').catch(() => {});
    }
  }

  setupListeners() {
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const view = el.getAttribute('data-view');
        this.switchView(view);
      });
    });

    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        window.commandPalette.toggle();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        window.stateManager.undo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        window.stateManager.redo();
      }
    });

    const btnQuickTask = document.getElementById('btn-quick-task');
    if (btnQuickTask) {
      btnQuickTask.addEventListener('click', () => {
        const title = prompt('Enter task title:');
        if (title) {
          window.taskEngine.createTask({ title });
        }
      });
    }
  }

  switchView(view) {
    this.currentView = view;
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(el => {
      el.classList.toggle('active', el.getAttribute('data-view') === view);
    });
    document.getElementById('current-view-title').innerText = view.charAt(0).toUpperCase() + view.slice(1);
    this.render();
  }

  render() {
    const container = document.getElementById('main-view-container');
    if (!container) return;

    const metrics = window.analyticsEngine.computeMetrics();

    if (this.currentView === 'dashboard') {
      container.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem;">
          <div class="card"><h3>Total Tasks</h3><p style="font-size:2rem; font-weight:bold;">${metrics.total}</p></div>
          <div class="card"><h3>Completed</h3><p style="font-size:2rem; font-weight:bold; color:var(--success);">${metrics.completed}</p></div>
          <div class="card"><h3>Overdue</h3><p style="font-size:2rem; font-weight:bold; color:var(--danger);">${metrics.overdue}</p></div>
          <div class="card"><h3>Completion Rate</h3><p style="font-size:2rem; font-weight:bold; color:var(--accent);">${metrics.completionRate}%</p></div>
        </div>
        <div class="card">
          <h3>Recent Activity</h3>
          <ul style="list-style:none; margin-top:1rem;">
            ${window.stateManager.state.activityLogs.slice(0, 5).map(log => `<li style="padding:0.5rem 0; border-bottom:1px solid var(--border);">${log.action} <span style="float:right; color:var(--text-secondary);">${new Date(log.timestamp).toLocaleTimeString()}</span></li>`).join('')}
          </ul>
        </div>
      `;
    } else if (this.currentView === 'tasks') {
      const tasks = window.stateManager.state.tasks;
      container.innerHTML = `
        <div class="card">
          <h3>Task Engine</h3>
          <table style="width:100%; border-collapse:collapse; margin-top:1rem;">
            <thead><tr style="text-align:left; border-bottom:1px solid var(--border);"><th style="padding:0.5rem;">Title</th><th>Status</th><th>Priority</th><th>Due Date</th><th>Actions</th></tr></thead>
            <tbody>
              ${tasks.map(t => `<tr style="border-bottom:1px solid var(--border);"><td style="padding:0.5rem;">${t.title}</td><td>${t.status}</td><td>${t.priority}</td><td>${t.dueDate || 'None'}</td><td><button class="btn" onclick="window.taskEngine.deleteTask('${t.id}')">Delete</button></td></tr>`).join('')}
            </tbody>
          </table>
        </div>
      `;
    } else if (this.currentView === 'developer') {
      container.innerHTML = `
        <div class="card">
          <h3>Developer Panel & Stress Test</h3>
          <p style="margin-top:1rem;">Generate bulk tasks for stress testing the search, filter, and analytics engines.</p>
          <div style="margin-top:1rem; display:flex; gap:1rem;">
            <button class="btn" onclick="window.uiManager.generateTasks(100)">Generate 100 Tasks</button>
            <button class="btn" onclick="window.uiManager.generateTasks(1000)">Generate 1,000 Tasks</button>
            <button class="btn" onclick="window.uiManager.generateTasks(5000)">Generate 5,000 Tasks</button>
            <button class="btn" style="background:var(--danger);" onclick="window.uiManager.clearDB()">Clear Database</button>
          </div>
        </div>
      `;
    } else {
      container.innerHTML = `<div class="card"><h3>${this.currentView.toUpperCase()}</h3><p>Module active and operational.</p></div>`;
    }
  }

  generateTasks(count) {
    for (let i = 0; i < count; i++) {
      window.stateManager.state.tasks.push({
        id: 'task_' + Math.random().toString(36).substr(2, 9),
        title: `Stress Test Task ${i + 1}`,
        description: 'Auto-generated for stress testing.',
        status: ['todo', 'in-progress', 'done'][Math.floor(Math.random() * 3)],
        priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
        createdAt: new Date().toISOString(),
        dueDate: null
      });
    }
    window.stateManager.persist();
    window.stateManager.notify();
    this.showToast(`Successfully generated ${count} tasks.`, 'success');
  }

  clearDB() {
    if (confirm('Are you sure you want to clear all tasks?')) {
      window.stateManager.state.tasks = [];
      window.stateManager.persist();
      window.stateManager.notify();
      this.showToast('Database cleared.', 'info');
    }
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    if (next === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  applySettings() {}
}

window.uiManager = new UIManager();
window.showToast = (msg, type) => window.uiManager.showToast(msg, type);
window.addEventListener('DOMContentLoaded', () => window.uiManager.init());
