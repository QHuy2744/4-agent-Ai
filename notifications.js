/**
 * notifications.js - Notification center management.
 */
class NotificationManager {
  constructor(stateManager) {
    this.stateManager = stateManager;
  }

  markAsRead(id) {
    const notif = this.stateManager.state.notifications.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      this.stateManager.persist();
      this.stateManager.notify();
    }
  }

  markAllRead() {
    this.stateManager.state.notifications.forEach(n => n.read = true);
    this.stateManager.persist();
    this.stateManager.notify();
  }

  deleteNotification(id) {
    this.stateManager.state.notifications = this.stateManager.state.notifications.filter(n => n.id !== id);
    this.stateManager.persist();
    this.stateManager.notify();
  }
}

window.notificationManager = new NotificationManager(window.stateManager);
