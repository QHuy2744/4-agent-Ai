/**
 * tasks.js - Task Engine handling CRUD, validation, subtasks, tags, and time tracking.
 */
class TaskEngine {
  constructor(stateManager) {
    this.stateManager = stateManager;
  }

  validateTask(taskData, existingTasks = []) {
    if (!taskData.title || typeof taskData.title !== 'string' || taskData.title.trim() === '') {
      throw new Error('Task title cannot be empty.');
    }
    if (taskData.id && existingTasks.some(t => t.id === taskData.id && t !== taskData._original)) {
      throw new Error('Task ID must be unique.');
    }
    if (taskData.dependencies && taskData.id && taskData.dependencies.includes(taskData.id)) {
      throw new Error('Task cannot depend on itself.');
    }
    // Cycle check
    if (taskData.dependencies && taskData.dependencies.length > 0 && taskData.id) {
      for (const depId of taskData.dependencies) {
        if (this._hasDependencyCycle(depId, taskData.id, existingTasks)) {
          throw new Error('Dependency cycle detected.');
        }
      }
    }
    return true;
  }

  _hasDependencyCycle(currentId, targetId, tasks) {
    const task = tasks.find(t => t.id === currentId);
    if (!task || !task.dependencies) return false;
    if (task.dependencies.includes(targetId)) return true;
    return task.dependencies.some(depId => this._hasDependencyCycle(depId, targetId, tasks));
  }

  createTask(data) {
    this.stateManager.pushHistory();
    const newTask = {
      id: 'task_' + Math.random().toString(36).substr(2, 9),
      title: data.title.trim(),
      description: data.description || '',
      status: data.status || this.stateManager.state.settings.defaultStatus,
      priority: data.priority || this.stateManager.state.settings.defaultPriority,
      projectId: data.projectId || '',
      tags: data.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dueDate: data.dueDate || null,
      completedAt: data.status === 'done' ? new Date().toISOString() : null,
      estimatedMinutes: Number(data.estimatedMinutes) || 0,
      actualMinutes: Number(data.actualMinutes) || 0,
      subtasks: data.subtasks || [],
      dependencies: data.dependencies || [],
      notes: data.notes || ''
    };

    this.validateTask(newTask, this.stateManager.state.tasks);
    this.stateManager.state.tasks.push(newTask);
    this.stateManager.persist();
    this.stateManager.logActivity(`Created task: ${newTask.title}`);
    this.stateManager.addNotification('Task Created', `Successfully created task "${newTask.title}"`, 'success');
    this.stateManager.notify();
    return newTask;
  }

  updateTask(id, updates) {
    this.stateManager.pushHistory();
    const tasks = this.stateManager.state.tasks;
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Task not found.');

    const updated = {
      ...tasks[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    if (updates.status === 'done' && tasks[index].status !== 'done') {
      updated.completedAt = new Date().toISOString();
    } else if (updates.status && updates.status !== 'done') {
      updated.completedAt = null;
    }

    updated._original = tasks[index];
    this.validateTask(updated, tasks);
    delete updated._original;

    tasks[index] = updated;
    this.stateManager.persist();
    this.stateManager.logActivity(`Updated task: ${updated.title}`);
    this.stateManager.notify();
    return updated;
  }

  deleteTask(id) {
    this.stateManager.pushHistory();
    const tasks = this.stateManager.state.tasks;
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Task not found.');
    const removed = tasks.splice(index, 1)[0];
    this.stateManager.persist();
    this.stateManager.logActivity(`Deleted task: ${removed.title}`);
    this.stateManager.addNotification('Task Deleted', `Deleted task "${removed.title}"`, 'info');
    this.stateManager.notify();
    return removed;
  }

  duplicateTask(id) {
    const tasks = this.stateManager.state.tasks;
    const task = tasks.find(t => t.id === id);
    if (!task) return null;
    return this.createTask({
      ...task,
      title: `${task.title} (Copy)`,
      id: undefined
    });
  }

  completeTask(id, completed = true) {
    return this.updateTask(id, {
      status: completed ? 'done' : 'todo'
    });
  }
}

window.taskEngine = new TaskEngine(window.stateManager);
