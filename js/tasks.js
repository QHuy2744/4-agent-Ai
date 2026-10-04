/* ========================================================================== */
// Tasks Module - CRUD Operations, Filter, Search, Sort
/* ========================================================================== */

const TaskManager = {
    generateId() {
        return 'task_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
    },

    addTask(taskData) {
        state.recordState();
        const newTask = {
            id: this.generateId(),
            title: taskData.title.trim(),
            description: taskData.description ? taskData.description.trim() : '',
            status: taskData.status || 'backlog',
            priority: taskData.priority || 'medium',
            deadline: taskData.deadline || '',
            tags: taskData.tags ? taskData.tags.map(t => t.trim()).filter(Boolean) : [],
            createdAt: new Date().toISOString()
        };
        state.tasks.unshift(newTask);
        state.notify();
        return newTask;
    },

    updateTask(id, taskData) {
        state.recordState();
        const index = state.tasks.findIndex(t => t.id === id);
        if (index === -1) return null;

        state.tasks[index] = {
            ...state.tasks[index],
            title: taskData.title.trim(),
            description: taskData.description ? taskData.description.trim() : '',
            status: taskData.status || state.tasks[index].status,
            priority: taskData.priority || state.tasks[index].priority,
            deadline: taskData.deadline !== undefined ? taskData.deadline : state.tasks[index].deadline,
            tags: taskData.tags ? taskData.tags.map(t => t.trim()).filter(Boolean) : state.tasks[index].tags
        };

        state.notify();
        return state.tasks[index];
    },

    updateTaskStatus(id, newStatus) {
        state.recordState();
        const task = state.tasks.find(t => t.id === id);
        if (!task || task.status === newStatus) return false;

        task.status = newStatus;
        state.notify();
        return true;
    },

    deleteTask(id) {
        state.recordState();
        const index = state.tasks.findIndex(t => t.id === id);
        if (index === -1) return false;

        state.tasks.splice(index, 1);
        state.notify();
        return true;
    },

    getTaskById(id) {
        return state.tasks.find(t => t.id === id);
    },

    /**
     * Get filtered and sorted tasks
     */
    getProcessedTasks() {
        let result = [...state.tasks];

        // 1. Search query filter
        if (state.searchQuery) {
            const q = state.searchQuery;
            result = result.filter(t => 
                t.title.toLowerCase().includes(q) ||
                t.description.toLowerCase().includes(q) ||
                (t.tags && t.tags.some(tag => tag.toLowerCase().includes(q)))
            );
        }

        // 2. Priority filter
        if (state.filters.priorities.length > 0) {
            result = result.filter(t => state.filters.priorities.includes(t.priority));
        }

        // 3. Tag filter
        if (state.filters.tags.length > 0) {
            result = result.filter(t => 
                t.tags && t.tags.some(tag => state.filters.tags.includes(tag))
            );
        }

        // 4. Sorting
        const [field, direction] = state.sortBy.split('-');
        const priorityWeight = { urgent: 4, high: 3, medium: 2, low: 1 };

        result.sort((a, b) => {
            let valA, valB;

            if (field === 'createdAt') {
                valA = new Date(a.createdAt).getTime();
                valB = new Date(b.createdAt).getTime();
            } else if (field === 'deadline') {
                // Tasks without deadline go last
                if (!a.deadline && !b.deadline) return 0;
                if (!a.deadline) return 1;
                if (!b.deadline) return -1;
                valA = new Date(a.deadline).getTime();
                valB = new Date(b.deadline).getTime();
            } else if (field === 'priority') {
                valA = priorityWeight[a.priority] || 0;
                valB = priorityWeight[b.priority] || 0;
            } else if (field === 'title') {
                valA = a.title.toLowerCase();
                valB = b.title.toLowerCase();
            }

            if (valA < valB) return direction === 'asc' ? -1 : 1;
            if (valA > valB) return direction === 'asc' ? 1 : -1;
            return 0;
        });

        return result;
    },

    getAllUniqueTags() {
        const tagsSet = new Set();
        state.tasks.forEach(t => {
            if (Array.isArray(t.tags)) {
                t.tags.forEach(tag => tagsSet.add(tag));
            }
        });
        return Array.from(tagsSet).sort();
    }
};