import { initStore, getState } from './state.js';
import { initDatabase } from './database.js';
import { initSecurity } from './security.js';
import { initLogger, handleError } from './error-handler.js';
import { initEvents } from './events.js';
import { initCommands } from './commands.js';
import { initShortcuts } from './shortcuts.js';
import { initShell } from './ui/shell.js';
import { registerServiceWorker } from './services/worker-manager.js';

class OmegaDesktop {
  async init() {
    try {
      initLogger();
      initSecurity();
      initEvents();
      await initDatabase();
      await initStore();
      initCommands();
      initShortcuts();
      initShell();
      registerServiceWorker();
      console.log('OMEGA DESKTOP successfully booted.');
    } catch (err) {
      handleError(err, 'FATAL', 'AppBoot');
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const omega = new OmegaDesktop();
  omega.init();
});

export default OmegaDesktop;