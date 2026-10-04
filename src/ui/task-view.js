import { getState, dispatch } from '../state.js';

export function renderTaskManager(container) {
  const state = getState();
  container.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;">
      <h3>Tasks (${state.tasks.length})</h3>
      <button id="add-task-btn">New Task</button>
    </div>
    <table>
      <thead><tr><th>Title</th><th>Status</th><th>Priority</th></tr></thead>
      <tbody id="task-table-body">
        ${state.tasks.map(t => `<tr><td>${t.title}</td><td>${t.status}</td><td>${t.priority}</td></tr>`).join('')}
      </tbody>
    </table>
  `;
  container.querySelector('#add-task-btn').addEventListener('click', () => {
    const title = prompt('Task Title:');
    if (title) dispatch('ADD_TASK', { id: Math.random().toString(), title, status: 'todo', priority: 'medium' });
  });
}