export function initLogger() {
  window.onerror = (msg, url, line, col, error) => {
    handleError(error || msg, 'ERROR', 'WindowError');
  };
  window.onunhandledrejection = event => {
    handleError(event.reason, 'ERROR', 'UnhandledRejection');
  };
}

export function handleError(err, severity = 'ERROR', source = 'Unknown') {
  console.error(`[${severity}] [${source}]`, err);
  const boundary = document.getElementById('global-error-boundary');
  const msgEl = document.getElementById('error-message');
  const idEl = document.getElementById('error-id');
  if (boundary && msgEl) {
    msgEl.textContent = err.message || String(err);
    idEl.textContent = 'ErrID: ' + Math.random().toString(36).substr(2, 9);
    boundary.classList.remove('hidden');
  }
}