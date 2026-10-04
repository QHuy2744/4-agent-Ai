/**
 * import-export.js - JSON Export and Import with schema validation and merge/replace strategy.
 */
class ImportExportEngine {
  constructor(stateManager) {
    this.stateManager = stateManager;
  }

  exportJSON() {
    const data = {
      schemaVersion: 1,
      exportedAt: new Date().toISOString(),
      tasks: this.stateManager.state.tasks,
      projects: this.stateManager.state.projects,
      settings: this.stateManager.state.settings
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexus-titan-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.stateManager.addNotification('Export Successful', 'Full system backup exported successfully.', 'success');
  }

  importJSON(jsonString, strategy = 'merge') {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.schemaVersion || !Array.isArray(parsed.tasks) || !Array.isArray(parsed.projects)) {
        throw new Error('Invalid backup schema.');
      }

      this.stateManager.pushHistory();
      if (strategy === 'replace') {
        this.stateManager.state.tasks = parsed.tasks;
        this.stateManager.state.projects = parsed.projects;
        if (parsed.settings) this.stateManager.state.settings = parsed.settings;
      } else {
        // Merge strategy
        const existingTaskIds = new Set(this.stateManager.state.tasks.map(t => t.id));
        const existingProjIds = new Set(this.stateManager.state.projects.map(p => p.id));

        parsed.tasks.forEach(t => {
          if (!existingTaskIds.has(t.id)) {
            this.stateManager.state.tasks.push(t);
          }
        });

        parsed.projects.forEach(p => {
          if (!existingProjIds.has(p.id)) {
            this.stateManager.state.projects.push(p);
          }
        });
      }

      this.stateManager.persist();
      this.stateManager.logActivity('Imported data successfully');
      this.stateManager.addNotification('Import Successful', 'Data imported successfully.', 'success');
      this.stateManager.notify();
      return true;
    } catch (e) {
      this.stateManager.addNotification('Import Failed', e.message, 'error');
      throw e;
    }
  }
}

window.exportEngine = new ImportExportEngine(window.stateManager);
