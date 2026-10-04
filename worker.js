/**
 * worker.js - Web Worker for heavy dataset computations and analytics.
 */
self.onmessage = function(e) {
  const { type, tasks } = e.data;
  if (type === 'COMPUTE_ANALYTICS') {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'done').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    self.postMessage({
      type: 'ANALYTICS_RESULT',
      result: { total, completed, completionRate }
    });
  }
};
