import { getState, dispatch } from '../state.js';

export function renderProjectManager(container) {
  const state = getState();
  container.innerHTML = `
    <div>
      <h3>Projects (${state.projects.length})</h3>
      <button id="add-proj-btn">New Project</button>
      <ul>${state.projects.map(p => `<li>${p.name}</li>`).join('')}</ul>
    </div>
  `;
  container.querySelector('#add-proj-btn').addEventListener('click', () => {
    const name = prompt('Project Name:');
    if (name) dispatch('ADD_PROJECT', { id: Math.random().toString(), name });
  });
}