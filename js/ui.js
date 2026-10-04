/* ========================================================================== */
// UI Module - Dashboard Stats, Render Board, Toasts, Modals, Theme
/* ========================================================================== */

const UI = {
    init() {
        this.bindEvents();
        this.render(state);
        this.initTheme();
    },

    initTheme() {
        const theme = state.settings.theme || 'light';
        document.documentElement.setAttribute('data-theme', theme);
    },

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        state.setTheme(newTheme);
        this.showToast('Giao diện', `Đã chuyển sang chế độ ${newTheme === 'dark' ? 'Tối' : 'Sáng'}`, 'info');
    },

    bindEvents() {
        // Theme toggle
        document.getElementById('btn-theme-toggle').addEventListener('click', () => this.toggleTheme());

        // New task buttons
        document.getElementById('btn-new-task').addEventListener('click', () => this.openTaskModal());
        document.querySelectorAll('.btn-add-in-column').forEach(btn => {
            btn.addEventListener('click', e => {
                const status = btn.getAttribute('data-status');
                this.openTaskModal(null, status);
            });
        });

        // Modal close buttons
        document.querySelectorAll('.btn-close-modal, .modal-backdrop').forEach(el => {
            el.addEventListener('click', () => {
                this.closeAllModals();
            });
        });

        // Task Form Submit
        document.getElementById('task-form').addEventListener('submit', e => {
            e.preventDefault();
            this.handleTaskFormSubmit();
        });

        // Search Input
        const searchInput = document.getElementById('search-input');
        const clearSearchBtn = document.getElementById('btn-clear-search');
        searchInput.addEventListener('input', e => {
            state.setSearchQuery(e.target.value);
            clearSearchBtn.style.display = e.target.value ? 'block' : 'none';
            this.renderBoard();
        });

        clearSearchBtn.addEventListener('click', () => {
            searchInput.value = '';
            clearSearchBtn.style.display = 'none';
            state.setSearchQuery('');
            this.renderBoard();
        });

        // Filter Toggle & Panel
        const filterToggleBtn = document.getElementById('btn-filter-toggle');
        const filterPanel = document.getElementById('filter-panel');
        filterToggleBtn.addEventListener('click', e => {
            e.stopPropagation();
            const isVisible = filterPanel.classList.toggle('show');
            filterToggleBtn.setAttribute('aria-expanded', isVisible);
        });

        document.addEventListener('click', e => {
            if (!filterPanel.contains(e.target) && !filterToggleBtn.contains(e.target)) {
                filterPanel.classList.remove('show');
                filterToggleBtn.setAttribute('aria-expanded', 'false');
            }
        });

        // Filter Options change
        document.getElementById('filter-priority-options').addEventListener('change', () => {
            this.updateFiltersFromUI();
        });
        document.getElementById('filter-tags-container').addEventListener('change', () => {
            this.updateFiltersFromUI();
        });
        document.getElementById('btn-reset-filters').addEventListener('click', () => {
            this.resetFilters();
        });

        // Sort Select
        document.getElementById('sort-select').addEventListener('change', e => {
            state.setSortBy(e.target.value);
            this.renderBoard();
        });

        // Undo / Redo buttons
        document.getElementById('btn-undo').addEventListener('click', () => {
            if (state.undo()) {
                this.showToast('Hoàn tác', 'Đã khôi phục thao tác trước', 'info');
            }
        });
        document.getElementById('btn-redo').addEventListener('click', () => {
            if (state.redo()) {
                this.showToast('Làm lại', 'Đã áp dụng lại thao tác', 'info');
            }
        });

        // IO Dropdown
        const ioMenuBtn = document.getElementById('btn-io-menu');
        const ioDropdown = ioMenuBtn.nextElementSibling;
        ioMenuBtn.addEventListener('click', e => {
            e.stopPropagation();
            ioDropdown.classList.toggle('show');
        });
        document.addEventListener('click', () => {
            ioDropdown.classList.remove('show');
        });

        document.getElementById('btn-export').addEventListener('click', () => {
            ImportExportManager.exportJSON();
        });

        document.getElementById('btn-import').addEventListener('click', () => {
            document.getElementById('import-file-input').click();
        });

        document.getElementById('import-file-input').addEventListener('change', e => {
            if (e.target.files.length > 0) {
                ImportExportManager.importJSON(e.target.files[0]);
                e.target.value = '';
            }
        });

        // Mobile status action modal buttons
        document.querySelectorAll('.btn-move-status').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetStatus = btn.getAttribute('data-status');
                const taskId = document.getElementById('mobile-action-modal').getAttribute('data-current-task-id');
                if (taskId && targetStatus) {
                    const success = TaskManager.updateTaskStatus(taskId, targetStatus);
                    if (success) {
                        this.showToast('Thành công', 'Đã di chuyển công việc', 'success');
                    }
                    this.closeAllModals();
                }
            });
        });
    },

    render(currentState) {
        this.renderStats(currentState.tasks);
        this.renderBoard();
        this.renderFilterTagsOptions();
        this.updateUndoRedoButtons();
    },

    renderStats(tasks) {
        const total = tasks.length;
        const inProgress = tasks.filter(t => t.status === 'inprogress').length;
        const completed = tasks.filter(t => t.status === 'done').length;
        const now = new Date();
        const overdue = tasks.filter(t => t.deadline && new Date(t.deadline) < now && t.status !== 'done').length;

        const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

        document.getElementById('stat-total').textContent = total;
        document.getElementById('stat-inprogress').textContent = inProgress;
        document.getElementById('stat-completed').textContent = completed;
        document.getElementById('stat-overdue').textContent = overdue;
        document.getElementById('stat-progress-percent').textContent = `${percent}%`;
        
        const progressBar = document.getElementById('stat-progress-bar');
        progressBar.style.width = `${percent}%`;
        progressBar.closest('.progress-bar-container').setAttribute('aria-valuenow', percent);
    },

    renderBoard() {
        const processedTasks = TaskManager.getProcessedTasks();

        const columns = {
            backlog: document.getElementById('col-backlog'),
            todo: document.getElementById('col-todo'),
            inprogress: document.getElementById('col-inprogress'),
            done: document.getElementById('col-done')
        };

        const counts = {
            backlog: 0,
            todo: 0,
            inprogress: 0,
            done: 0
        };

        // Clear columns
        Object.values(columns).forEach(col => col.innerHTML = '');

        if (processedTasks.length === 0) {
            Object.keys(columns).forEach(status => {
                columns[status].innerHTML = `
                    <div class="empty-state">
                        <i class="fa-solid fa-folder-open empty-icon" aria-hidden="true"></i>
                        <p>Không có công việc nào</p>
                    </div>
                `;
            });
        } else {
            processedTasks.forEach(task => {
                counts[task.status]++;
                const card = KanbanManager.createTaskCard(task);
                if (columns[task.status]) {
                    columns[task.status].appendChild(card);
                }
            });

            // Check empty columns
            Object.keys(columns).forEach(status => {
                if (counts[status] === 0) {
                    columns[status].innerHTML = `
                        <div class="empty-state">
                            <p>Trống</p>
                        </div>
                    `;
                }
            });
        }

        // Update counts
        document.getElementById('count-backlog').textContent = state.tasks.filter(t => t.status === 'backlog').length;
        document.getElementById('count-todo').textContent = state.tasks.filter(t => t.status === 'todo').length;
        document.getElementById('count-inprogress').textContent = state.tasks.filter(t => t.status === 'inprogress').length;
        document.getElementById('count-done').textContent = state.tasks.filter(t => t.status === 'done').length;
    },

    renderFilterTagsOptions() {
        const container = document.getElementById('filter-tags-container');
        const tags = TaskManager.getAllUniqueTags();
        
        if (tags.length === 0) {
            container.innerHTML = `<span class="no-tags-hint">Chưa có nhãn nào</span>`;
            return;
        }

        container.innerHTML = tags.map(tag => `
            <label><input type="checkbox" value="${tag}"> #${tag}</label>
        `).join('');
    },

    updateFiltersFromUI() {
        const priorities = Array.from(document.querySelectorAll('#filter-priority-options input:checked')).map(el => el.value);
        const tags = Array.from(document.querySelectorAll('#filter-tags-container input:checked')).map(el => el.value);

        state.setFilters(priorities, tags);
        
        const badgeCount = priorities.length + tags.length;
        const filterBadge = document.getElementById('filter-badge');
        if (badgeCount > 0) {
            filterBadge.textContent = badgeCount;
            filterBadge.style.display = 'inline-block';
        } else {
            filterBadge.style.display = 'none';
        }

        this.renderBoard();
    },

    resetFilters() {
        document.querySelectorAll('#filter-priority-options input, #filter-tags-container input').forEach(el => el.checked = false);
        state.setFilters([], []);
        document.getElementById('filter-badge').style.display = 'none';
        this.renderBoard();
    },

    updateUndoRedoButtons() {
        document.getElementById('btn-undo').disabled = !state.canUndo();
        document.getElementById('btn-redo').disabled = !state.canRedo();
    },

    openTaskModal(taskId = null, defaultStatus = 'backlog') {
        const modal = document.getElementById('task-modal');
        const titleEl = document.getElementById('modal-title');
        const form = document.getElementById('task-form');
        form.reset();
        document.getElementById('task-id').value = '';
        document.getElementById('task-title-input').classList.remove('is-invalid');

        if (taskId) {
            titleEl.textContent = 'Chỉnh sửa công việc';
            const task = TaskManager.getTaskById(taskId);
            if (task) {
                document.getElementById('task-id').value = task.id;
                document.getElementById('task-title-input').value = task.title;
                document.getElementById('task-desc-input').value = task.description || '';
                document.getElementById('task-status-input').value = task.status;
                document.getElementById('task-priority-input').value = task.priority;
                document.getElementById('task-deadline-input').value = task.deadline || '';
                document.getElementById('task-tags-input').value = task.tags ? task.tags.join(', ') : '';
            }
        } else {
            titleEl.textContent = 'Thêm task mới';
            document.getElementById('task-status-input').value = defaultStatus;
        }

        modal.style.display = 'flex';
        document.getElementById('task-title-input').focus();
    },

    openMobileActionModal(taskId) {
        const modal = document.getElementById('mobile-action-modal');
        const task = TaskManager.getTaskById(taskId);
        if (!task) return;

        modal.setAttribute('data-current-task-id', taskId);
        document.getElementById('mobile-task-preview-name').textContent = task.title;
        modal.style.display = 'flex';
    },

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
    },

    handleTaskFormSubmit() {
        const id = document.getElementById('task-id').value;
        const titleInput = document.getElementById('task-title-input');
        const title = titleInput.value.trim();

        if (!title) {
            titleInput.classList.add('is-invalid');
            titleInput.focus();
            return;
        }
        titleInput.classList.remove('is-invalid');

        const description = document.getElementById('task-desc-input').value;
        const status = document.getElementById('task-status-input').value;
        const priority = document.getElementById('task-priority-input').value;
        const deadline = document.getElementById('task-deadline-input').value;
        const tagsStr = document.getElementById('task-tags-input').value;
        const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(Boolean) : [];

        if (id) {
            TaskManager.updateTask(id, { title, description, status, priority, deadline, tags });
            this.showToast('Thành công', 'Đã cập nhật công việc', 'success');
        } else {
            TaskManager.addTask({ title, description, status, priority, deadline, tags });
            this.showToast('Thành công', 'Đã thêm công việc mới', 'success');
        }

        this.closeAllModals();
    },

    showToast(title, message, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const iconMap = {
            success: 'fa-circle-check',
            error: 'fa-circle-exclamation',
            warning: 'fa-triangle-exclamation',
            info: 'fa-circle-info'
        };

        toast.innerHTML = `
            <i class="fa-solid ${iconMap[type] || iconMap.success} toast-icon" aria-hidden="true"></i>
            <div class="toast-content">
                <span class="toast-title">${title}</span>
                <span class="toast-msg">${message}</span>
            </div>
            <button type="button" class="toast-close" aria-label="Đóng thông báo">
                <i class="fa-solid fa-xmark" aria-hidden="true"></i>
            </button>
        `;

        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.remove();
        });

        container.appendChild(toast);

        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 3000);
    }
};