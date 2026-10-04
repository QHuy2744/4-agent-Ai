/**
 * search.js - Advanced search engine supporting syntax like status:done priority:high.
 */
class SearchEngine {
  constructor(stateManager) {
    this.stateManager = stateManager;
  }

  search(query) {
    const tasks = this.stateManager.state.tasks;
    if (!query || query.trim() === '') return tasks;

    const tokens = query.toLowerCase().split(/\s+/);
    const filters = {};
    const textTerms = [];

    tokens.forEach(token => {
      if (token.includes(':')) {
        const [key, value] = token.split(':');
        filters[key] = value;
      } else {
        textTerms.push(token);
      }
    });

    return tasks.filter(task => {
      // Check filters
      if (filters.status && task.status !== filters.status) return false;
      if (filters.priority && task.priority !== filters.priority) return false;
      if (filters.project && task.projectId !== filters.project) return false;
      if (filters.tag && (!task.tags || !task.tags.includes(filters.tag))) return false;
      if (filters.overdue === 'true') {
        if (!task.dueDate || new Date(task.dueDate) >= new Date() || task.status === 'done') return false;
      }

      // Check text terms
      if (textTerms.length > 0) {
        const combinedText = `${task.title} ${task.description} ${task.notes}`.toLowerCase();
        const matchesAll = textTerms.every(term => combinedText.includes(term));
        if (!matchesAll) return false;
      }

      return true;
    });
  }
}

window.searchEngine = new SearchEngine(window.stateManager);
