export function initShortcuts() {
  window.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      const palette = document.getElementById('command-palette');
      if (palette) palette.classList.toggle('hidden');
      const input = document.getElementById('palette-input');
      if (input) input.focus();
    }
  });
}