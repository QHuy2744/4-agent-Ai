/**
 * analytics.js - Analytics computation engine and SVG chart generator.
 */
class AnalyticsEngine {
  constructor(stateManager) {
    this.stateManager = stateManager;
  }

  computeMetrics() {
    const tasks = this.stateManager.state.tasks;
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'done').length;
    const todo = tasks.filter(t => t.status === 'todo').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const blocked = tasks.filter(t => t.status === 'blocked').length;
    const review = tasks.filter(t => t.status === 'review').length;
    
    const now = new Date();
    const overdue = tasks.filter(t => t.dueDate && new Date(t.dueDate) < now && t.status !== 'done').length;
    const highPriority = tasks.filter(t => t.priority === 'high' || t.priority === 'urgent').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const overdueRate = total > 0 ? Math.round((overdue / total) * 100) : 0;

    return {
      total,
      completed,
      todo,
      inProgress,
      blocked,
      review,
      overdue,
      highPriority,
      completionRate,
      overdueRate
    };
  }

  renderBarChart(containerId, data, labels) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const max = Math.max(...data, 1);
    let html = '<div class="chart-bars">';
    data.forEach((val, i) => {
      const height = Math.round((val / max) * 100);
      html += `<div class="chart-bar-col" title="${labels[i]}: ${val}">
                 <div class="chart-bar" style="height: ${height}%"></div>
                 <span class="chart-label">${labels[i]}</span>
               </div>`;
    });
    html += '</div>';
    container.innerHTML = html;
  }
}

window.analyticsEngine = new AnalyticsEngine(window.stateManager);
