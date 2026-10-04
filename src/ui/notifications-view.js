import { getState } from '../state.js';

export function renderNotifications(container) {
  const state = getState();
  container.innerHTML = `<div><h3>Notifications</h3><ul>${state.notifications.map(n => `<li>${n.title}: ${n.message}</li>`).join('')}</ul></div>`;
}