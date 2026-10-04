*(Triển khai theo vai trò PLANNER. Không sửa code sản phẩm.)*

Đã kiểm tra cấu trúc thư mục (thư mục hiện tại chưa có `.bangiao`, tiến hành thiết lập kế hoạch chi tiết). Dưới đây là kế hoạch hoàn chỉnh cho yêu cầu xây dựng web app **“NEXUS TITAN”** – hệ thống quản lý tác vụ cực lớn dùng để stress-test quy trình 4 agent.

---

### 1. MỤC TIÊU VÀ PHẠM VI

- **Mục tiêu:** Xây dựng một ứng dụng web quản lý công việc và năng suất quy mô lớn (“NEXUS TITAN”) hoàn toàn bằng HTML5, CSS3, ES6+ JavaScript thuần, IndexedDB (với fallback localStorage) và Web Worker, đạt tiêu chuẩn khắt khe về kiến trúc modular, hiệu năng, PWA, accessibility và tự kiểm thử (self-test).
- **Phạm vi:** 
  - Hoàn thiện toàn bộ danh sách 22 file theo đúng kiến trúc yêu cầu.
  - Xây dựng app shell đầy đủ trạng thái (Dark/Light/System theme, Compact/Comfortable, Toast, Modal, Skeleton).
  - Triển khai Dashboard, Task Engine (CRUD, Subtasks, Dependencies), Kanban (Drag & Drop), Project Management, Calendar, Advanced Search, Command Palette (Ctrl+K), Undo/Redo Engine, Persistence (IndexedDB + fallback), Import/Export, Activity Log, Analytics Engine, Web Worker xử lý dữ liệu nặng, Mass Data Test (1k - 10k tasks), Notification System, Settings, PWA (manifest, service-worker), Global Error Handling và Developer/Self-Test Panel.

---

### 2. CÁC FILE CẦN TẠO / SỬA (Đường dẫn chính xác)

Toàn bộ các file sau sẽ được tạo mới trong thư mục gốc của dự án:
1. `index.html` - Khung HTML chính, chứa App Shell, các view container, modal, toast container, mobile bottom nav.
2. `style.css` - CSS toàn cục, định nghĩa biến màu sắc (Dark/Light mode), layout (Sidebar, Topbar, Main), utility classes, animation và responsive media queries.
3. `state.js` - Quản lý Global State, Event Emitter/PubSub cho UI reactive, quản lý lịch sử Undo/Redo.
4. `storage.js` - Xử lý IndexedDB (với fallback sang localStorage), quản lý version migration, hàm save/load toàn cục.
5. `tasks.js` - Task Engine: CRUD, validation (dependency cycles, empty title, v.v.), subtasks, tags, time tracking.
6. `projects.js` - Project Management: CRUD, archive, restore, thống kê tiến độ từng project.
7. `calendar.js` - Calendar view (Month/Week), tính toán ngày tháng, xử lý timezone, hiển thị deadline/overdue.
8. `analytics.js` - Tính toán các chỉ số năng suất (completion rate, overdue rate, thời gian trung bình, phân phối priority/status).
9. `search.js` - Advanced Search Engine: hỗ trợ query `status:`, `priority:`, `project:`, `tag:`, `overdue:true`, realtime highlight.
10. `commands.js` - Command Palette (Ctrl+K), xử lý phím tắt, danh sách lệnh thực thi nhanh.
11. `settings.js` - Quản lý cài đặt người dùng, lưu trữ cấu hình, áp dụng theme/compact mode.
12. `notifications.js` - Notification Center: tạo, đọc, xóa thông báo, quản lý task sắp đến hạn/quá hạn.
13. `import-export.js` - Xuất/Nhập dữ liệu JSON, validate schema, xử lý chế độ Replace/Merge.
14. `worker.js` - Web Worker để xử lý tính toán analytics nặng và lọc dataset lớn (10,000 tasks) không block UI.
15. `manifest.json` - PWA Manifest.
16. `service-worker.js` - Service Worker cho caching cơ bản và offline fallback.
17. `app.js` - File điều phối chính (Bootstrap), khởi tạo các module, thiết lập Global Error Handling (`onerror`, `unhandledrejection`), gắn event listener toàn cục.
18. `README.md` - Tài liệu chi tiết về kiến trúc, data model, hướng dẫn chạy và giới hạn ứng dụng.

---

### 3. CÁC BƯỚC THỰC HIỆN (Cho Coder)

1. **Khởi tạo nền tảng cốt lõi:**
   - Tạo `manifest.json` và `service-worker.js`.
   - Viết `storage.js` để kết nối IndexedDB (hoặc fallback localStorage) với cơ chế DB versioning và migration an toàn.
   - Viết `state.js` quản lý state trung tâm, tích hợp Undo/Redo stack (Ctrl+Z, Ctrl+Y).
2. **Xây dựng UI Shell & Giao diện:**
   - Viết `index.html` cấu trúc Semantic HTML chuẩn Accessibility (`aria-*`, keyboard navigation).
   - Viết `style.css` hoàn chỉnh với hệ thống biến CSS cho Dark/Light mode, Compact/Comfortable mode, responsive layout cho Desktop/Tablet/Mobile, Toast, Modal, Skeleton loading.
3. **Phát triển các Engine nghiệp vụ:**
   - `tasks.js`: Xây dựng đầy đủ CRUD task, subtasks, validation chống dependency cycle, tính toán actual/estimated time.
   - `projects.js`: Quản lý project, chống xóa project khi còn task liên quan nếu chưa có xác nhận.
   - `calendar.js`: Render lịch Tháng/Tuần, map task deadline vào ngày tương ứng.
   - `analytics.js` & `worker.js`: Xử lý phân tích dữ liệu qua Web Worker để đảm bảo mượt mà khi test dataset lớn.
   - `search.js` & `commands.js`: Advanced search với query syntax và Command Palette (Ctrl+K).
4. **Tích hợp tính năng phụ trợ & Developer Tools:**
   - `import-export.js`: Backup và khôi phục dữ liệu JSON có kiểm tra schema/duplicate ID.
   - `notifications.js`: Hệ thống thông báo thời gian thực và quản lý notification center.
   - `settings.js`: Lưu trữ và áp dụng tùy chọn người dùng.
   - Bổ sung Developer Panel trong `app.js` / giao diện để generate dữ liệu giả (100, 1k, 5k, 10k tasks) phục vụ stress test và chạy cơ chế Self-Test tự động (báo PASS/FAIL).
5. **Bootstrap ứng dụng:**
   - Viết `app.js` để gắn kết toàn bộ module, khởi tạo Global Error Handling, đăng ký Service Worker.

---

### 4. CÁCH KIỂM TRA (Dành cho Tester)

Tester phải thực hiện kiểm tra thực tế (không được đoán mò) các tiêu chí sau:
- **File Existence:** Kiểm tra đủ 18 file theo danh sách.
- **Syntax & Execution:** Mở `index.html` trên trình duyệt, không có lỗi console trắng trang.
- **CRUD & State:** Thêm, sửa, xóa, hoàn thành Task và Project; kiểm tra Undo (Ctrl+Z) và Redo (Ctrl+Y).
- **Kanban & Drag-Drop:** Thao tác kéo thả task giữa các cột, kiểm tra state và localStorage/IndexedDB cập nhật đúng.
- **Search & Filter:** Sử dụng advanced search với cú pháp `status:done priority:high`.
- **Worker & Performance:** Chạy Developer Panel sinh 10,000 tasks, kiểm tra giao diện không bị treo, analytics load mượt mà nhờ Web Worker.
- **Import/Export:** Xuất dữ liệu JSON và import lại thành công (kiểm tra validation schema).
- **PWA & Offline:** Kiểm tra Service Worker đăng ký thành công và app hoạt động khi offline.
- **Self-Test:** Chạy bộ tự kiểm tra trong Developer Settings và xác nhận kết quả `PASS` cho các test case.

---

### 5. RỦI RO

- **Rủi ro 1:** Xử lý Drag & Drop trên thiết bị di động (Touch devices) có thể gặp giật lag nếu không tối ưu hóa sự kiện touch. *Giải pháp:* Sử dụng Pointer Events API kết hợp tính năng keyboard fallback.
- **Rủi ro 2:** Dataset lớn (10,000 tasks) có thể làm chậm DOM rendering. *Giải pháp:* Áp dụng pagination/virtualization đơn giản và chuyển toán tử nặng sang `worker.js`.
- **Rủi ro 3:** IndexedDB lỗi trên một số trình duyệt ẩn danh (Incognito mode). *Giải pháp:* Xây dựng cơ chế fallback tự động sang `localStorage` được định nghĩa sẵn trong `storage.js`.

---
*(Kế hoạch đã sẵn sàng. Coder có thể tiến hành triển khai mã nguồn theo đúng các thông số kỹ thuật trên.)*
