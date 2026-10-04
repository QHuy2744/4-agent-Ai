/**
 * calendar.js - Calendar view computations and date management.
 */
class CalendarEngine {
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.currentDate = new Date();
  }

  getTasksForDate(dateString) {
    return this.stateManager.state.tasks.filter(t => {
      if (!t.dueDate) return false;
      return t.dueDate.startsWith(dateString);
    });
  }

  getMonthDays(year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    // Padding for start of week
    const startDayOfWeek = firstDay.getDay();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      days.push({ date: d, isCurrentMonth: false });
    }

    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const d = new Date(year, month, i);
      days.push({ date: d, isCurrentMonth: true });
    }

    // Padding for end of week
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const d = new Date(year, month + 1, i);
      days.push({ date: d, isCurrentMonth: false });
    }

    return days;
  }
}

window.calendarEngine = new CalendarEngine(window.stateManager);
