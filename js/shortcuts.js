/* ========================================================================== */
// Shortcuts Module - Keyboard Shortcuts & Accessibility Navigation
/* ========================================================================== */

const ShortcutsManager = {
    init() {
        document.addEventListener('keydown', e => {
            // Don't trigger if user is typing in input or textarea
            const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
            const isInputActive = activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select';

            // New task shortcut: 'N' or 'n'
            if (!isInputActive && (e.key === 'n' || e.key === 'N')) {
                e.preventDefault();
                UI.openTaskModal();
                return;
            }

            // Search focus shortcut: '/'
            if (!isInputActive && e.key === '/') {
                e.preventDefault();
                document.getElementById('search-input').focus();
                return;
            }

            // Escape key closes modals or clears search
            if (e.key === 'Escape') {
                UI.closeAllModals();
                document.getElementById('filter-panel').classList.remove('show');
                return;
            }

            // Ctrl+Z for Undo
            if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z') && !e.shiftKey) {
                if (state.canUndo()) {
                    e.preventDefault();
                    if (state.undo()) {
                        UI.showToast('Hoàn tác', 'Đã khôi phục thao tác trước', 'info');
                    }
                }
                return;
            }

            // Ctrl+Y or Ctrl+Shift+Z for Redo
            if ((e.ctrlKey || e.metaKey) && ((e.key === 'y' || e.key === 'Y') || (e.key === 'z' && e.shiftKey))) {
                if (state.canRedo()) {
                    e.preventDefault();
                    if (state.redo()) {
                        UI.showToast('Làm lại', 'Đã áp dụng lại thao tác', 'info');
                    }
                }
                return;
            }
        });
    }
};