export function initSecurity() {
  window.addEventListener('securitypolicyviolation', e => {
    console.error('CSP Violation:', e);
  });
}

export function sanitizeHTML(str) {
  const temp = document.createElement('div');
  temp.textContent = str;
  return temp.innerHTML;
}