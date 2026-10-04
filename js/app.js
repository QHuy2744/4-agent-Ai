/* ========================================================================== */
// App Entry Point - TaskForge Initialization
/* ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    console.log('TaskForge Pro Initializing...');

    // 1. Initialize State and Subscribe UI updates
    state.subscribe(currentState => {
        UI.render(currentState);
    });

    // 2. Initialize UI components and event listeners
    UI.init();

    // 3. Initialize Kanban drag and drop
    KanbanManager.init();

    // 4. Initialize Keyboard shortcuts
    ShortcutsManager.init();

    console.log('TaskForge Pro successfully initialized!');
});