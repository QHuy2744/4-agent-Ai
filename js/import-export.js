/* ========================================================================== */
// Import/Export Module - JSON Data Backup & Validation
/* ========================================================================== */

const ImportExportManager = {
    exportJSON() {
        try {
            const data = {
                version: 1,
                exportedAt: new Date().toISOString(),
                tasks: state.tasks,
                settings: state.settings
            };
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute("download", `taskforge_backup_${new Date().toISOString().slice(0, 10)}.json`);
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
            UI.showToast('Thành công', 'Đã xuất dữ liệu ra file JSON', 'success');
        } catch (e) {
            console.error('Export error:', e);
            UI.showToast('Lỗi', 'Không thể xuất dữ liệu', 'error');
        }
    },

    importJSON(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const parsed = JSON.parse(e.target.result);
                
                // Schema Validation
                if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.tasks)) {
                    throw new Error('Cấu trúc file JSON không hợp lệ. Thiếu trường tasks.');
                }

                // Validate each task basic structure
                for (const t of parsed.tasks) {
                    if (!t.id || !t.title || !t.status) {
                        throw new Error('Một số task thiếu thông tin bắt buộc (id, title, status).');
                    }
                }

                state.recordState();
                state.tasks = parsed.tasks;
                if (parsed.settings && parsed.settings.theme) {
                    state.settings = parsed.settings;
                    document.documentElement.setAttribute('data-theme', state.settings.theme);
                }
                state.notify();
                UI.showToast('Thành công', `Đã nhập thành công ${parsed.tasks.length} công việc`, 'success');
            } catch (err) {
                console.error('Import parse error:', err);
                UI.showToast('Lỗi nhập file', err.message || 'File JSON không đúng định dạng', 'error');
            }
        };
        reader.onerror = () => {
            UI.showToast('Lỗi', 'Không thể đọc file', 'error');
        };
        reader.readAsText(file);
    }
};