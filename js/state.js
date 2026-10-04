/* ========================================================================== */
// State Module - Central State Management & Undo/Redo (Command Pattern)
/* ========================================================================== */

class AppState {
    constructor() {
        const initial = Storage.loadData();
        this.tasks = initial.tasks;
        this.settings = initial.settings;
        
        this.searchQuery = '';
        this.filters = {
            priorities: [],
            tags: []
        };
        this.sortBy = 'createdAt-desc';

        // Undo / Redo stacks (stores snapshots of tasks array)
        this.undoStack = [];
        this.redoStack = [];
        this.maxHistory = 20;

        this.listeners = [];
    }

    subscribe(listener) {
        this.listeners.push(listener);
    }

    notify() {
        Storage.saveData(this.tasks, this.settings);
        this.listeners.forEach(listener => listener(this));
    }

    // Push current task state to history before making mutation
    recordState() {
        this.undoStack.push(JSON.parse(JSON.stringify(this.tasks)));
        if (this.undoStack.length > this.maxHistory) {
            this.undoStack.shift();
        }
        // Clear redo stack on new user action
        this.redoStack = [];
    }

    undo() {
        if (this.undoStack.length === 0) return false;
        
        // Push current to redo
        this.redoStack.push(JSON.parse(JSON.stringify(this.tasks)));
        this.tasks = this.undoStack.pop();
        this.notify();
        return true;
    }

    redo() {
        if (this.redoStack.length === 0) return false;

        // Push current to undo
        this.undoStack.push(JSON.parse(JSON.stringify(this.tasks)));
        this.tasks = this.redoStack.pop();
        this.notify();
        return true;
    }

    canUndo() {
        return this.undoStack.length > 0;
    }

    canRedo() {
        return this.redoStack.length > 0;
    }

    setTheme(theme) {
        this.settings.theme = theme;
        this.notify();
    }

    setSearchQuery(query) {
        this.searchQuery = query.trim().toLowerCase();
    }

    setFilters(priorities, tags) {
        this.filters.priorities = priorities;
        this.filters.tags = tags;
    }

    setSortBy(sortBy) {
        this.sortBy = sortBy;
    }
}

const state = new AppState();