import { dispatch } from './state.js';

export function notify(title, message, type = 'info') {
  dispatch('ADD_NOTIFICATION', { id: Math.random().toString(), title, message, type, time: Date.now(), read: false });
}