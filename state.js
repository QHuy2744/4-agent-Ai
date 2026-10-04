/**
 * state.js - Central State Management, PubSub, and Undo/Redo history stack.
 */
class StateManager {
  constructor() {
    this.state = {
      tasks: [],
      projects: [],
      settings: {
        theme: 'system',
        accent: 'blue',
        compactMode: false,
        animations: true,
        reducedMotion: false,
        defaultPriority: 'medium',
        defaultStatus: 'todo',
        itemsPerPage: 25,
        confirmDelete: true,
        notificationsEnabled: true
      },
      activityLogs: [],
      notifications: []
    };
    this.listeners = [];
    this.history = [];
    this.redoStack = [];
    this.maxHistory = 50;
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener(this.state));
  }

  async loadState() {
    const tasks = await window.storageEngine.get('nexus_tasks') || [];
    const projects = await window.storageEngine.get('nexus_projects') || [];
    const settings = await window.storageEngine.get('nexus_settings') || this.state.settings;
    const activityLogs = await window.storageEngine.get('nexus_activity') || [];
    const notifications = await window.storageEngine.get('nexus_notifications') || [];

    this.state = { tasks, projects, settings, activityLogs, notifications };
    this.notify();
  }

  async persist() {
    await window.storageEngine.set('nexus_tasks', this.state.tasks);
    await window.storageEngine.set('nexus_projects', this.state.projects);
    await window.storageEngine.set('nexus_settings', this.state.settings);
    await window.storageEngine.set('nexus_activity', this.state.activityLogs);
    await window.storageEngine.set('nexus_notifications', this.state.notifications);
  }

  pushHistory() {
    const snapshot = JSON.parse(JSON.stringify({
      tasks: this.state.tasks,
      projects: this.state.projects,
      settings: this.state.settings
    }));
    this.history.push(snapshot);
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }
    this.redoStack = [];
  }

  undo() {
    if (this.history.length === 0) return false;
    const currentSnapshot = JSON.parse(JSON.stringify({
      tasks: this.state.tasks,
      projects: this.state.projects,
      settings: this.state.settings
    }));
    this.redoStack.push(currentSnapshot);
    const previous = this.history.pop();
    this.state.tasks = previous.tasks;
    this.state.projects = previous.projects;
    this.state.settings = previous.settings;
    this.persist();
    this.notify();
    this.logActivity('Undo performed');
    return true;
  }

  redo() {
    if (this.redoStack.length === 0) return false;
    const currentSnapshot = JSON.parse(JSON.stringify({
      tasks: this.state.tasks,
      projects: this.state.projects,
      settings: this.state.settings
    }));
    this.history.push(currentSnapshot);
    const next = this.redoStack.pop();
    this.state.tasks = next.tasks;
    this.state.projects = next.projects;
    this.state.settings = next.settings;
    this.persist();
    this.notify();
    this.logActivity('Redo performed');
    return true;
  }

  logActivity(action) {
    const log = {
      id: 'act_' + Math.random().toString(36).substr(2, 9),
      action,
      timestamp: new Date().toISOString()
    };
    this.state.activityLogs.unshift(log);
    if (this.state.activityLogs.length > 200) this.state.activityLogs.pop();
    window.storageEngine.set('nexus_activity', this.state.activityLogs);
  }

  addNotification(title, message, type = 'info') {
    if (!this.state.settings.notificationsEnabled) return;
    const notif = {
      id: 'notif_' + Math.random().toString(36).substr(2, 9),
      title,
      message,
      type,
      read: false,
      timestamp: new Date().toISOString()
    };
    this.state.notifications.unshift(notif);
    window.storageEngine.set('nexus_notifications', this.state.notifications);
    this.notify();
    if (window.showToast) window.showToast(message, type);
  }
}

window.stateManager = new StateManager();
