/* ========================================================================== */
// Storage Module - LocalStorage Persistence & Migration
/* ========================================================================== */

const STORAGE_KEY = 'taskforge_data_v1';

const Storage = {
    /**
     * Load data from localStorage with schema validation & migration
     * @returns {Object} { tasks: Array, settings: Object }
     */
    loadData() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) {
                return this.getDefaultData();
            }
            const parsed = JSON.parse(raw);
            if (!parsed || !Array.isArray(parsed.tasks)) {
                console.warn('Invalid storage format, falling back to default data.');
                return this.getDefaultData();
            }
            return {
                tasks: parsed.tasks,
                settings: Object.assign({ theme: 'light' }, parsed.settings || {})
            };
        } catch (e) {
            console.error('Error loading data from localStorage:', e);
            return this.getDefaultData();
        }
    },

    /**
     * Save tasks and settings to localStorage
     * @param {Array} tasks 
     * @param {Object} settings 
     */
    saveData(tasks, settings) {
        try {
            const payload = {
                version: 1,
                updatedAt: new Date().toISOString(),
                tasks,
                settings
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
            return true;
        } catch (e) {
            console.error('Error saving data to localStorage:', e);
            return false;
        }
    },

    /**
     * Get initial demo data if localStorage is empty
     */
    getDefaultData() {
        const now = new Date();
        const tomorrow = new Date(now.getTime() + 86400000);
        const nextWeek = new Date(now.getTime() + 7 * 86400000);
        const yesterday = new Date(now.getTime() - 86400000);

        return {
            tasks: [
                {
                    id: 'task-1',
                    title: 'Khảo sát yêu cầu TaskForge Pro',
                    description: 'Phân tích 20 yêu cầu bắt buộc và lập kế hoạch kiến trúc chi tiết cho web app client-side.',
                    status: 'done',
                    priority: 'high',
                    deadline: yesterday.toISOString().slice(0, 16),
                    tags: ['planning', 'arch'],
                    createdAt: new Date(now.getTime() - 172800000).toISOString()
                },
                {
                    id: 'task-2',
                    title: 'Xây dựng giao diện Kanban & Dashboard',
                    description: 'Thiết kế hệ thống cột Kanban 4 trạng thái, tích hợp thống kê real-time và Dark Mode.',
                    status: 'inprogress',
                    priority: 'urgent',
                    deadline: tomorrow.toISOString().slice(0, 16),
                    tags: ['frontend', 'ui'],
                    createdAt: new Date(now.getTime() - 86400000).toISOString()
                },
                {
                    id: 'task-3',
                    title: 'Triển khai Drag-and-Drop và Mobile support',
                    description: 'Hỗ trợ HTML5 Drag and Drop trên desktop và modal chọn trạng thái trên mobile.',
                    status: 'todo',
                    priority: 'medium',
                    deadline: nextWeek.toISOString().slice(0, 16),
                    tags: ['frontend', 'ux'],
                    createdAt: now.toISOString()
                },
                {
                    id: 'task-4',
                    title: 'Viết tài liệu Hướng dẫn sử dụng README.md',
                    description: 'Mô tả chi tiết cách cài đặt, chạy ứng dụng, kiến trúc module và danh sách tính năng.',
                    status: 'backlog',
                    priority: 'low',
                    deadline: '',
                    tags: ['docs'],
                    createdAt: now.toISOString()
                }
            ],
            settings: {
                theme: 'light'
            }
        };
    }
};