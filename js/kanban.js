/* ========================================================================== */
// Kanban Module - Drag and Drop (Desktop) & Mobile Action Handler
/* ========================================================================== */

const KanbanManager = {
    init() {
        const columns = document.querySelectorAll('.kanban-column');

        columns.forEach(col => {
            const columnBody = col.querySelector('.column-body');
            const status = col.getAttribute('data-column');

            // Drag over
            columnBody.addEventListener('dragover', e => {
                e.preventDefault();
                columnBody.classList.add('drag-over');
            });

            // Drag leave
            columnBody.addEventListener('dragleave', e => {
                columnBody.classList.remove('drag-over');
            });

            // Drop
            columnBody.addEventListener('drop', e => {
                e.preventDefault();
                columnBody.classList.remove('drag-over');
                const taskId = e.dataTransfer.getData('text/plain');
                if (taskId) {
                    const success = TaskManager.updateTaskStatus(taskId, status);
                    if (success) {
                        UI.showToast('Thành công', 'Đã di chuyển công việc', 'success');
                    }
                }
            });
        });
    },

    createTaskCard(task) {
        const card = document.createElement('div');
        card.className = 'task-card';
        card.setAttribute('draggable', 'true');
        card.setAttribute('data-id', task.id);
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `Công việc: ${task.title}`);

        // Drag start
        card.addEventListener('dragstart', e => {
            e.dataTransfer.setData('text/plain', task.id);
            card.classList.add('dragging');
        });

        card.addEventListener('dragend', () => {
            card.classList.remove('dragging');
        });

        // Priority badge class & text
        const priorityMap = {
            low: { text: 'Thấp', class: 'badge-priority-low' },
            medium: { text: 'Trung bình', class: 'badge-priority-medium' },
            high: { text: 'Cao', class: 'badge-priority-high' },
            urgent: { text: 'Khẩn cấp', class: 'badge-priority-urgent' }
        };
        const pInfo = priorityMap[task.priority] || priorityMap.medium;

        // Deadline formatting & Overdue check
        let deadlineHtml = '';
        if (task.deadline) {
            const deadlineDate = new Date(task.deadline);
            const isOverdue = deadlineDate < new Date() && task.status !== 'done';
            const formattedDate = deadlineDate.toLocaleString('vi-VN', { 
                month: 'numeric', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            deadlineHtml = `
                <span class="task-deadline ${isOverdue ? 'overdue' : ''}" title="Deadline">
                    <i class="fa-regular fa-clock" aria-hidden="true"></i> ${formattedDate}
                </span>
            `;
        }

        // Tags html
        let tagsHtml = '';
        if (task.tags && task.tags.length > 0) {
            tagsHtml = `<div class="task-tags">` + 
                task.tags.map(tag => `<span class="task-tag">#${tag}</span>`).join('') + 
                `</div>`;
        }

        card.innerHTML = `
            <div class="task-card-header">
                <span class="task-title">${this.escapeHtml(task.title)}</span>
                <div class="task-card-actions">
                    <button class="btn btn-icon btn-sm mobile-move-btn" data-action="move" data-id="${task.id}" title="Di chuyển cột">
                        <i class="fa-solid fa-arrows-left-right" aria-hidden="true"></i>
                    </button>
                    <button class="btn btn-icon btn-sm" data-action="edit" data-id="${task.id}" title="Sửa task">
                        <i class="fa-solid fa-pen" aria-hidden="true"></i>
                    </button>
                    <button class="btn btn-icon btn-sm" data-action="delete" data-id="${task.id}" title="Xóa task">
                        <i class="fa-solid fa-trash" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
            ${task.description ? `<p class="task-desc">${this.escapeHtml(task.description)}</p>` : ''}
            ${tagsHtml}
            <div class="task-footer">
                <div class="task-meta-group">
                    <span class="task-badge ${pInfo.class}">${pInfo.text}</span>
                    ${deadlineHtml}
                </div>
            </div>
        `;

        // Event listeners for card actions
        card.addEventListener('click', e => {
            const btn = e.target.closest('button');
            if (!btn) return;
            const action = btn.getAttribute('data-action');
            const id = btn.getAttribute('data-id');

            if (action === 'edit') {
                UI.openTaskModal(id);
            } else if (action === 'delete') {
                if (confirm('Bạn có chắc chắn muốn xóa công việc này?')) {
                    TaskManager.deleteTask(id);
                    UI.showToast('Thành công', 'Đã xóa công việc', 'success');
                }
            } else if (action === 'move') {
                UI.openMobileActionModal(id);
            }
        });

        return card;
    },

    escapeHtml(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
};