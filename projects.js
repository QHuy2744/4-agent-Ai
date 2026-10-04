/**
 * projects.js - Project Management handling CRUD, archive, restore, and statistics.
 */
class ProjectEngine {
  constructor(stateManager) {
    this.stateManager = stateManager;
  }

  createProject(data) {
    if (!data.name || data.name.trim() === '') {
      throw new Error('Project name cannot be empty.');
    }
    this.stateManager.pushHistory();
    const newProj = {
      id: 'proj_' + Math.random().toString(36).substr(2, 9),
      name: data.name.trim(),
      description: data.description || '',
      color: data.color || '#3b82f6',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      archived: false
    };
    this.stateManager.state.projects.push(newProj);
    this.stateManager.persist();
    this.stateManager.logActivity(`Created project: ${newProj.name}`);
    this.stateManager.addNotification('Project Created', `Created project "${newProj.name}"`, 'success');
    this.stateManager.notify();
    return newProj;
  }

  updateProject(id, updates) {
    this.stateManager.pushHistory();
    const projects = this.stateManager.state.projects;
    const index = projects.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Project not found.');

    projects[index] = {
      ...projects[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.stateManager.persist();
    this.stateManager.logActivity(`Updated project: ${projects[index].name}`);
    this.stateManager.notify();
    return projects[index];
  }

  deleteProject(id, force = false) {
    const tasks = this.stateManager.state.tasks;
    const hasTasks = tasks.some(t => t.projectId === id);
    if (hasTasks && !force) {
      throw new Error('Project contains tasks. Confirm deletion or move tasks first.');
    }

    this.stateManager.pushHistory();
    const projects = this.stateManager.state.projects;
    const index = projects.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Project not found.');
    const removed = projects.splice(index, 1)[0];

    // Optionally unassign tasks
    tasks.forEach(t => {
      if (t.projectId === id) t.projectId = '';
    });

    this.stateManager.persist();
    this.stateManager.logActivity(`Deleted project: ${removed.name}`);
    this.stateManager.addNotification('Project Deleted', `Deleted project "${removed.name}"`, 'info');
    this.stateManager.notify();
    return removed;
  }

  archiveProject(id, archived = true) {
    return this.updateProject(id, { archived });
  }

  getProjectStats(projectId) {
    const tasks = this.stateManager.state.tasks.filter(t => t.projectId === projectId);
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'done').length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, rate };
  }
}

window.projectEngine = new ProjectEngine(window.stateManager);
