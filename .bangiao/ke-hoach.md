Dưới đây là kế hoạch triển khai chi tiết cho hệ thống **OMEGA DESKTOP** tuân thủ tuyệt đối các quy định của hệ thống. Kế hoạch này được thiết kế để Coder có thể thực hiện tuần tự, chính xác, không cần đoán ý và không vi phạm quy tắc Zero Cheating.

---

### 0. CÂU HỎI CÒN BỎ NGỎ (CHƯA RÕ RÀNG)
*Không có câu hỏi bỏ ngỏ nào; các yêu cầu kiến trúc, thành phần UI, cơ chế lưu trữ IndexedDB, Web Workers, Security, và Self-Test Engine đã được mô tả đầy đủ chi tiết trong đặc tả.*

---

### 1. MỤC TIÊU VÀ PHẠM VI
- **Mục tiêu:** Xây dựng hoàn chỉnh web application "OMEGA DESKTOP" — một browser operating system mini chạy hoàn toàn trên trình duyệt, không dùng API key, không backend thực, tối ưu hóa HTML/CSS/JavaScript thuần (ES Modules), hỗ trợ IndexedDB với localStorage fallback, Multi-worker, Self-Test Engine toàn diện, Command Palette, Spreadsheet với công thức, Terminal giả lập bảo mật tuyệt đối, và giao diện Responsive (Desktop/Tablet/Mobile).
- **Phạm vi:** Tạo lập toàn bộ cấu trúc file theo đúng sơ đồ kiến trúc được chỉ định trong yêu cầu, triển khai từ Global State Engine, Database, Core Engines (Task, Project, Calendar, Search, History, Sync), UI Shell, 12+ Applications, Services, Web Workers, đến Test Suite và Service Worker (PWA).

---

### 2. CÁC FILE CẦN TẠO / SỬA (ĐƯỜNG DẪN CHÍNH XÁC)
Toàn bộ danh sách file theo kiến trúc dự án:
- `index.html`
- `styles.css`
- `manifest.json`
- `service-worker.js`
- `README.md`
- `src/app.js`, `src/router.js`, `src/state.js`, `src/store.js`, `src/database.js`, `src/migrations.js`, `src/events.js`, `src/commands.js`, `src/shortcuts.js`, `src/notifications.js`, `src/permissions.js`, `src/security.js`, `src/logger.js`, `src/error-handler.js`, `src/serializer.js`
- `src/core/task-engine.js`, `src/core/project-engine.js`, `src/core/calendar-engine.js`, `src/core/search-engine.js`, `src/core/history-engine.js`, `src/core/sync-engine.js`
- `src/ui/shell.js`, `src/ui/sidebar.js`, `src/ui/topbar.js`, `src/ui/modal.js`, `src/ui/toast.js`, `src/ui/dialogs.js`, `src/ui/task-view.js`, `src/ui/project-view.js`, `src/ui/calendar-view.js`, `src/ui/spreadsheet-view.js`, `src/ui/editor-view.js`, `src/ui/terminal-view.js`, `src/ui/analytics-view.js`, `src/ui/settings-view.js`, `src/ui/file-manager-view.js`, `src/ui/notifications-view.js`
- `src/services/search-index.js`, `src/services/analytics.js`, `src/services/worker-manager.js`, `src/services/export-service.js`, `src/services/import-service.js`, `src/services/backup-service.js`, `src/services/encryption-service.js`
- `src/workers/analytics.worker.js`, `src/workers/search.worker.js`, `src/workers/import.worker.js`
- `tests/test-runner.js`, `tests/state-tests.js`, `tests/task-tests.js`, `tests/project-tests.js`, `tests/search-tests.js`, `tests/history-tests.js`, `tests/storage-tests.js`, `tests/import-export-tests.js`, `tests/analytics-tests.js`, `tests/security-tests.js`, `tests/performance-tests.js`, `tests/integration-tests.js`

---

### 3. CÁC BƯỚC THỰC HIỆN CHI TIẾT CHO CODER

#### Bước 1: Khởi tạo Cấu trúc & Nền tảng Core (Storage & State)
1. **`src/database.js` & `src/migrations.js`**: Thiết lập kết nối IndexedDB với các object stores (`tasks`, `projects`, `documents`, `spreadsheets`, `files`, `notifications`, `settings`, `activity`, `snapshots`), version schema, cơ chế migration tự động, và fallback hoàn toàn sang `localStorage` nếu IndexedDB không khả dụng hoặc lỗi.
2. **`src/security.js` & `src/encryption-service.js`**: Tích hợp Web Crypto API để mã hóa/giải mã dữ liệu nhạy cảm (backup, PIN), kiểm tra tính toàn vẹn (checksum), chống prototype pollution, chống path traversal, không dùng `eval()` hay `new Function()`.
3. **`src/state.js`, `src/store.js`, `src/events.js`**: Xây dựng Global State Management với immutable-style updates, subscriptions, selectors, derived state, batched updates, kết hợp Global Event Bus (`src/events.js`) ngăn chặn listener leak và recursive loop.
4. **`src/error-handler.js` & `src/logger.js`**: Bắt lỗi toàn cục (`window.onerror`, `unhandledrejection`), ghi log an toàn (không chứa secret), cung cấp error boundary dạng UI hiển thị Error ID và technical details khi ở Developer Mode.

#### Bước 2: Xây dựng Core Engines & Services
1. **Task & Project Engines (`src/core/task-engine.js`, `src/core/project-engine.js`)**: Quản lý CRUD, phân tầng subtasks, xử lý dependency graph (`A -> B -> C`), thuật toán phát hiện cycle (`A -> B -> C -> A` hoặc `A -> A` bị chặn tuyệt đối), bulk actions, recurrence rules.
2. **Calendar, Search, History & Sync Engines (`src/core/calendar-engine.js`, `src/core/search-engine.js`, `src/core/history-engine.js`, `src/core/sync-engine.js`)**: 
   - Calendar hỗ trợ month/week/day/agenda, drag/reschedule, recurring patterns.
   - History engine hỗ trợ Undo/Redo toàn cục (`Ctrl+Z`, `Ctrl+Y`) với transaction groups.
   - Sync engine với local change queue, hỗ trợ last-write-wins và manual conflict resolution.
3. **Web Workers & Services (`src/services/` và `src/workers/`)**: 
   - Triển khai `analytics.worker.js`, `search.worker.js`, `import.worker.js`.
   - `worker-manager.js` quản lý giao tiếp qua PostMessage, xử lý timeout/error tránh treo main thread.
   - Export/Import/Backup service với validate nghiêm ngặt (malformed JSON, missing fields, wrong schema, duplicate IDs).

#### Bước 3: Phát triển Desktop Shell & Giao diện Ứng dụng (UI Layer)
1. **Shell & Window Manager (`src/ui/shell.js`, `src/ui/sidebar.js`, `src/ui/topbar.js`, `src/ui/modal.js`, `src/ui/toast.js`, `src/ui/dialogs.js`)**: 
   - Giả lập Desktop background, app launcher, taskbar, system tray, clock, notification center.
   - Window manager hỗ trợ: Open, Close, Minimize, Maximize, Restore, Move, Resize, Focus, Z-index, multiple windows, window snapping, và mobile responsive layout (full-screen panels, không overflow ngang).
2. **12+ Applications (`src/ui/*-view.js`)**: 
   - Task, Project, Calendar, Spreadsheet (grid 100x50, công thức `=SUM()`, `=AVG()`, `=MIN()`, `=MAX()` bằng cú pháp an toàn không dùng `eval`), Text Editor (plain text, markdown preview, autosave, undo/redo), Terminal Simulator (sandbox hoàn toàn trên virtual filesystem với các lệnh cơ bản), File Manager (virtual path, chống path traversal), Analytics (biểu đồ Canvas/SVG từ dữ liệu thật), Settings, Notifications, Search, Developer Tools (State inspector, performance metrics, storage stats, fuzz testing, data generator 50,000 tasks/files).
3. **Command Palette & Shortcuts (`src/commands.js`, `src/shortcuts.js`)**: 
   - Kích hoạt bằng `Ctrl + K`, chứa ít nhất 30 commands theo đúng yêu cầu, hỗ trợ keyboard navigation đầy đủ.

#### Bước 4: Tích hợp PWA, Internationalization & Themes
1. **`manifest.json` & `service-worker.js`**: Cache app shell, cung cấp offline fallback hoạt động ổn định.
2. **i18n & Theme Engine**: Hỗ trợ runtime switching ngôn ngữ (English / Vietnamese), Dark / Light / System themes, High contrast, Reduced motion, Custom CSS variables.

#### Bước 5: Viết Self-Test Suite & Đảm bảo Chất lượng
1. **`tests/test-runner.js` và các file test (`tests/*-tests.js`)**: Triển khai đầy đủ các bài test tự động cho state, database, migration, task/project CRUD, dependency cycle, search, undo/redo, backup/restore, import validation, spreadsheet formulas, file/terminal sandbox, permissions, session lock, notifications, analytics, worker messages, event bus, PWA, offline mode, error handling, security checks.
2. Trả kết quả chuẩn xác `PASS`, `FAIL`, hoặc `SKIP` (kèm lý do rõ ràng, tuyệt đối không gian lận đổi `SKIP` thành `PASS`).

---

### 4. CÁCH KIỂM TRA (VERIFICATION PLAN)
- **Kiểm tra cú pháp & file:** Chạy lệnh build/kiểm tra syntax tĩnh của JavaScript (ES Modules).
- **Chạy Self-Test Engine:** Mở ứng dụng, bật Developer Tools, nhấn nút **"RUN ALL TESTS"** để chạy toàn bộ test suite và xác thực tất cả trả về `PASS`.
- **Kiểm tra tính năng thực tế:**
  - Tạo, sửa, xóa, gán dependency task (thử tạo vòng lặp cycle để đảm bảo hệ thống chặn thành công).
  - Sử dụng Spreadsheet, gõ công thức `=SUM(A1:A5)` và thay đổi cell để kiểm tra tính năng tính toán và dependency update.
  - Sử dụng Terminal, thao tác trên virtual filesystem (`ls`, `mkdir`, `cd`, `cat`, v.v.) và kiểm tra sandbox.
  - Test Import/Export với file JSON hợp lệ và malformed JSON để kiểm tra khả năng bắt lỗi không crash app.
  - Kiểm tra Responsive trên 3 mức màn hình (Desktop >= 1200px, Tablet 768-1199px, Mobile < 768px).
- **Kiểm tra Security:** Đảm bảo không có vết tích của `eval()`, `new Function()`, xử lý HTML an toàn không inject trực tiếp vào `innerHTML`.

---

### 5. RỦI RO VÀ BIỆN PHÁP PHÒNG NGỪA
1. **Rủi ro treo Main Thread khi xử lý dataset lớn (50,000 tasks):**
   - *Biện pháp:* Tận dụng triệt để Web Workers (`analytics.worker.js`, `search.worker.js`, `import.worker.js`) và áp dụng virtual rendering / lazy loading cho danh sách lớn.
2. **Rủi ro lỗi IndexedDB trên trình duyệt riêng tư / chặn storage:**
   - *Biện pháp:* Xây dựng cơ chế fallback hoàn toàn sang `localStorage` và bộ nhớ RAM (in-memory state) để ứng dụng vẫn chạy mượt mà không bị trắng trang.
3. **Rủi ro vòng lặp sự kiện (Event Loop Recursion) hoặc Memory Leak từ Event Bus:**
   - *Biện pháp:* Quản lý chặt chẽ danh sách listener trong `src/events.js`, hỗ trợ cơ chế unsubscribe tự động khi component/window đóng.
4. **Rủi ro vi phạm quy tắc Zero Cheating:**
   - *Biện pháp:* Tuân thủ nghiêm ngặt: không hard-code kết quả test, không fake PASS, mọi tính năng đều phải chạy thật logic code.
