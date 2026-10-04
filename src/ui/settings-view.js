import { getState, dispatch } from '../state.js';

export function renderSettings(container) {
  const state = getState();
  container.innerHTML = `
    <div>
      <h3>Settings</h3>
      <label>Theme: 
        <select id="theme-select">
          <option value="dark" ${state.settings.theme === 'dark' ? 'selected' : ''}>Dark</option>
          <option value="light" ${state.settings.theme === 'light' ? 'selected' : ''}>Light</option>
        </select>
      </label>
    </div>
  `;
  container.querySelector('#theme-select').addEventListener('change', e => {
    dispatch('UPDATE_SETTINGS', { theme: e.target.value });
    document.documentElement.setAttribute('data-theme', e.target.value);
  });
}

export function renderDeveloperTools(container) {
  container.innerHTML = `
    <div>
      <h3>Developer Tools</h3>
      <button id="run-all-tests-btn">RUN ALL TESTS</button>
      <pre id="test-results" style="background:#000;color:#0ff;padding:10px;margin-top:10px;max-height:300px;overflow:auto;"></pre>
    </div>
  `;
  container.querySelector('#run-all-tests-btn').addEventListener('click', async () => {
    const { runAllTests } = await import('../../tests/test-runner.js');
    const results = await runAllTests();
    container.querySelector('#test-results').textContent = results.map(r => `[${r.status}] ${r.name}: ${r.message || ''}`).join('\n');
  });
}