/**
 * settings.js - Settings management and persistence.
 */
class SettingsManager {
  constructor(stateManager) {
    this.stateManager = stateManager;
  }

  updateSettings(newSettings) {
    this.stateManager.pushHistory();
    this.stateManager.state.settings = {
      ...this.stateManager.state.settings,
      ...newSettings
    };
    this.stateManager.persist();
    this.stateManager.logActivity('Updated settings');
    this.stateManager.notify();
    window.uiManager.applySettings();
  }
}

window.settingsManager = new SettingsManager(window.stateManager);
