import { db } from './database.js';
import { emit } from './events.js';

let state = {
  tasks: [],
  projects: [],
  calendar: [],
  documents: [],
  spreadsheets: [],
  files: [],
  windows: [],
  notifications: [],
  settings: { theme: 'dark', compact: false, accent: '#3b82f6', language: 'en' },
  history: { undoStack: [], redoStack: [] },
  searchIndex: [],
  sessions: { activeUser: 'Admin', role: 'admin', locked: false, lastActivity: Date.now() },
  permissions: { role: 'admin', canExport: true, canImport: true, canDeveloper: true },
  analytics: { metrics: {} },
  syncMeta: { queue: [], lastSync: null },
  debugData: { errors: [] }
};

let listeners = [];

export async function initStore() {
  try {
    const tasks = await db.getAll('tasks') || [];
    const projects = await db.getAll('projects') || [];
    const files = await db.getAll('files') || [];
    const settings = await db.get('settings', 'app') || state.settings;
    state.tasks = tasks;
    state.projects = projects;
    state.files = files;
    state.settings = settings;
  } catch (err) {
    console.warn('Store init fallback to default state', err);
  }
}

export function getState() {
  return state;
}

export async function dispatch(action, payload) {
  const prevState = JSON.parse(JSON.stringify(state));
  switch (action) {
    case 'ADD_TASK':
      state.tasks.push(payload);
      await db.put('tasks', payload);
      emit('TASK_CREATED', payload);
      break;
    case 'UPDATE_TASK':
      state.tasks = state.tasks.map(t => t.id === payload.id ? payload : t);
      await db.put('tasks', payload);
      emit('TASK_UPDATED', payload);
      break;
    case 'DELETE_TASK':
      state.tasks = state.tasks.filter(t => t.id !== payload);
      await db.delete('tasks', payload);
      emit('TASK_DELETED', payload);
      break;
    case 'ADD_PROJECT':
      state.projects.push(payload);
      await db.put('projects', payload);
      emit('PROJECT_CREATED', payload);
      break;
    case 'UPDATE_SETTINGS':
      state.settings = { ...state.settings, ...payload };
      await db.put('settings', { id: 'app', ...state.settings });
      emit('SETTINGS_CHANGED', state.settings);
      break;
    case 'ADD_NOTIFICATION':
      state.notifications.unshift(payload);
      break;
    case 'CLEAR_NOTIFICATIONS':
      state.notifications = [];
      break;
    case 'OPEN_WINDOW':
      if (!state.windows.some(w => w.id === payload.id)) {
        state.windows.push({ ...payload, zIndex: state.windows.length + 1, minimized: false });
        emit('WINDOW_OPENED', payload);
      }
      break;
    case 'CLOSE_WINDOW':
      state.windows = state.windows.filter(w => w.id !== payload);
      emit('WINDOW_CLOSED', payload);
      break;
    case 'TOGGLE_LOCK':
      state.sessions.locked = !state.sessions.locked;
      break;
    default:
      console.warn('Unknown action:', action);
  }
  state.history.undoStack.push({ action, payload, prevState });
  state.history.redoStack = [];
  notifyListeners();
}

export function subscribe(listener) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
}

function notifyListeners() {
  listeners.forEach(l => l(state));
}