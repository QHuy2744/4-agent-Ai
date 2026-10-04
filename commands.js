/**
 * commands.js - Command Palette (Ctrl+K) handler and shortcuts.
 */
class CommandPalette {
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.isOpen = false;
  }

  toggle() {
    this.isOpen = !this.isOpen;
    const modal = document.getElementById('command-palette-modal');
    if (modal) {
      modal.style.display = this.isOpen ? 'flex' : 'none';
      if (this.isOpen) {
        const input = document.getElementById('command-input');
        if (input) input.focus();
      }
    }
  }

  getCommands() {
    return [
      { id: 'create-task', title: 'Create New Task', action: () => window.uiManager.openTaskModal() },
      { id: 'create-project', title: 'Create New Project', action: () => window.uiManager.openProjectModal() },
      { id: 'view-dashboard', title: 'Open Dashboard', action: () => window.uiManager.switchView('dashboard') },
      { id: 'view-tasks', title: 'Open Tasks List', action: () => window.uiManager.switchView('tasks') },
      { id: 'view-kanban', title: 'Open Kanban Board', action: () => window.uiManager.switchView('kanban') },
      { id: 'view-calendar', title: 'Open Calendar', action: () => window.uiManager.switchView('calendar') },
      { id: 'view-analytics', title: 'Open Analytics', action: () => window.uiManager.switchView('analytics') },
      { id: 'toggle-theme', title: 'Toggle Dark/Light Theme', action: () => window.uiManager.toggleTheme() },
      { id: 'export-data', title: 'Export Backup JSON', action: () => window.exportEngine.exportJSON() },
      { id: 'import-data', title: 'Import Backup JSON', action: () => window.uiManager.openImportModal() },
      { id: 'undo', title: 'Undo Last Action', action: () => window.stateManager.undo() },
      { id: 'redo', title: 'Redo Action', action: () => window.stateManager.redo() },
      { id: 'settings', title: 'Open Settings', action: () => window.uiManager.switchView('settings') }
    ];
  }
}

window.commandPalette = new CommandPalette(window.stateManager);
