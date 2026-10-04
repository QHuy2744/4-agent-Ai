Dựa trên yêu cầu tính năng xây dựng web app quản lý công việc cao cấp **TaskForge** (chạy hoàn toàn phía client, vanilla HTML/CSS/JS, responsive, Kanban, localStorage, Undo/Redo, Dark/Light mode, Import/Export, v.v.), dưới đây là kế hoạch chi tiết được chuẩn bị cho agent Coder.

---

### 1. Mục tiêu
- Xây dựng hoàn chỉnh ứng dụng web **TaskForge** theo đúng 20 yêu cầu bắt buộc.
- Cấu trúc code thuần túy (Vanilla HTML, CSS, JavaScript) chia module rõ ràng, không dùng framework/thư viện ngoài.
- Đảm bảo trải nghiệm xuất sắc trên cả Desktop (kéo-thả drag-and-drop, phím tắt, accessibility) và Mobile (cơ chế chuyển cột thay thế drag-and-drop, giao diện mobile-first).
- Lưu trữ dữ liệu bền vững qua `localStorage` kèm cơ chế migration an toàn, hỗ trợ Undo/Redo, Import/Export JSON có validation, Dark/Light mode, Toast notifications, Modal validation, Empty/Loading/Error states.

---

### 2. File cần tạo/sửa
Do đây là việc xây dựng lại hoặc khởi tạo mới từ cấu trúc hiện tại (sau khi đã dùng tool `Glob`/`Read` kiểm tra thư mục), các file dự kiến sẽ bao gồm:
- `index.html`: Khung HTML chính, các cấu trúc modal, toast container, template cho task card, dashboard stats, toolbar (tìm kiếm, bộ lọc, sắp xếp, import/export, dark mode toggle).
- `css/styles.css`: Hệ thống biến màu (CSS Variables) cho Dark/Light mode, thiết kế hiện đại mobile-first, giao diện Kanban board 4 cột, responsive layout, trạng thái drag-and-drop, empty/loading/error states, focus ring và accessibility styles.
- `js/app.js`: File khởi chạy chính (Entry point), gắn kết các module lại với nhau.
- `js/storage.js`: Quản lý `localStorage`, migration dữ liệu, cơ chế persistence an toàn.
- `js/state.js`: Quản lý trạng thái ứng dụng trung tâm, lịch sử Undo/Redo (command pattern hoặc state snapshot).
- `js/kanban.js`: Xử lý logic hiển thị cột, tương tác kéo-thả (HTML5 Drag and Drop API cho desktop) và cơ chế chuyển cột thân thiện trên mobile (modal/menu chọn trạng thái đích).
- `js/tasks.js`: Logic CRUD task, validate dữ liệu form, tìm kiếm, lọc đa điều kiện, sắp xếp.
- `js/ui.js`: Xử lý giao diện, Dashboard stats, Dark/Light mode toggle, Toast notifications, Modal open/close, Empty/Error states.
- `js/shortcuts.js`: Xử lý phím tắt trên desktop và điều hướng bàn phím (Accessibility).
- `js/import-export.js`: Xử lý xuất file JSON và nhập file JSON có kiểm tra lỗi định dạng/dữ liệu.
- `README.md`: Hướng dẫn cách chạy, kiến trúc thư mục và danh sách tính năng.

---

### 3. Các bước thực hiện
1. **Khởi tạo thư mục và cấu trúc cơ bản (`index.html`, `css/styles.css`)**:
   - Thiết lập cấu trúc HTML semantic rõ ràng, gắn các `aria-*` label, focus states phục vụ accessibility.
   - Viết CSS sử dụng CSS Variables để dễ dàng chuyển đổi giữa Dark Mode và Light Mode. Xây dựng giao diện responsive mobile-first với Kanban 4 cột (Backlog, To Do, In Progress, Done).
2. **Xây dựng tầng dữ liệu và State Management (`js/storage.js`, `js/state.js`)**:
   - Viết module đọc/ghi `localStorage` với xử lý lỗi (try/catch) và cơ chế migration cấu trúc dữ liệu nếu có phiên bản cũ.
   - Xây dựng state manager lưu danh sách tasks, filter, search query, sort options và quản lý stack Undo/Redo tối đa các thao tác gần nhất.
3. **Phát triển tính năng CRUD Task & Validation (`js/tasks.js`)**:
   - Viết hàm thêm, sửa, xóa task với tiêu đề, mô tả, ưu tiên (Low, Medium, High, Urgent), deadline, nhãn (tags), trạng thái.
   - Tạo validation chặt chẽ cho form modal (không để trống tiêu đề, định dạng deadline hợp lệ).
4. **Xây dựng tính năng Tìm kiếm, Lọc và Sắp xếp**:
   - Tìm kiếm real-time theo từ khóa (tiêu đề, mô tả, nhãn).
   - Bộ lọc kết hợp đồng thời (Trạng thái + Mức ưu tiên + Nhãn).
   - Sắp xếp theo Deadline, Mức ưu tiên, Ngày tạo (tăng/giảm dần).
5. **Xây dựng tương tác Kéo-thả (Kanban Drag & Drop) & Mobile Support (`js/kanban.js`)**:
   - Desktop: Sử dụng HTML5 Drag and Drop API cho phép kéo task thả qua lại giữa 4 cột.
   - Mobile: Bổ sung nút bấm menu hành động trên mỗi card (hoặc modal chọn trạng thái) để di chuyển task sang cột khác mượt mà trên màn hình cảm ứng.
6. **Xây dựng Dashboard thống kê & UI Utilities (`js/ui.js`)**:
   - Tính toán và cập nhật real-time các số liệu: Tổng công việc, Đang làm, Hoàn thành, Quá hạn, và % tiến độ.
   - Xây dựng hệ thống Toast Notification thông báo hành động (thêm, sửa, xóa, undo/redo, import/export thành công/lỗi).
   - Xây dựng Empty state, Loading state giả lập mượt mà, Error state trực quan.
7. **Xây dựng tính năng Import/Export JSON (`js/import-export.js`)**:
   - Export dữ liệu hiện tại ra file `.json` với timestamp.
   - Import file JSON kèm kiểm tra cấu trúc (schema validation), thông báo lỗi rõ ràng nếu file không hợp lệ.
8. **Phím tắt và Accessibility (`js/shortcuts.js`)**:
   - Hỗ trợ phím tắt (ví dụ: `Ctrl+Z` cho Undo, `Ctrl+Y` hoặc `Ctrl+Shift+Z` cho Redo, `N` để tạo task mới, `/` để focus tìm kiếm).
   - Kiểm tra tab order, focus ring rõ ràng.
9. **Hoàn thiện `README.md`**:
   - Viết tài liệu mô tả chi tiết kiến trúc module, cách mở ứng dụng (chỉ cần mở trực tiếp `index.html` hoặc chạy qua một static server nhẹ) và danh sách tính năng.

---

### 4. Cách kiểm tra
- **Kiểm tra trực quan (Visual & Responsive)**: Mở trên trình duyệt desktop và mobile (hoặc giả lập mobile trên DevTools) để kiểm tra giao diện Dark/Light mode, layout Kanban, độ mượt mà.
- **Kiểm tra CRUD & Validation**: Thêm task mới với dữ liệu thiếu/sai xem modal có chặn lại không; sửa, xóa task thành công và hiển thị Toast notification.
- **Kiểm tra Drag-and-Drop / Mobile action**: Kéo thả task qua 4 cột trên desktop; sử dụng nút chuyển đổi cột trên mobile.
- **Kiểm tra Filter / Search / Sort**: Kết hợp tìm kiếm từ khóa với bộ lọc trạng thái/ưu tiên/nhãn và sắp xếp theo deadline/ưu tiên.
- **Kiểm tra Persistence & Migration**: Reload trang xem dữ liệu có được giữ nguyên không; chỉnh sửa dữ liệu localStorage để kiểm tra cơ chế fallback/migration.
- **Kiểm tra Undo/Redo**: Thực hiện một vài thao tác CRUD, bấm Undo/Redo xem trạng thái có khôi phục chính xác không.
- **Kiểm tra Import/Export**: Export dữ liệu ra file JSON, thử import lại file chuẩn và file lỗi để kiểm tra thông báo lỗi.
- **Kiểm tra Console**: Mở F12 kiểm tra không có lỗi hay cảnh báo nghiêm trọng nào trong console.

---

### 5. Rủi ro
- **Xung đột sự kiện kéo-thả trên thiết bị di động (Touch devices)**: HTML5 Drag and Drop API gốc không hoạt động tốt trên thiết bị cảm ứng di động. *Giải pháp*: Cung cấp cơ chế thay thế rõ ràng trên mobile (menu chọn trạng thái trực tiếp trên card task thay vì bắt buộc kéo-thả).
- **Mất dữ liệu khi Import file JSON lỗi**: Người dùng có thể import file JSON sai cấu trúc làm hỏng app state. *Giải pháp*: Validate kỹ cấu trúc dữ liệu JSON trước khi ghi đè, nếu lỗi phải báo Toast/Modal thông báo chi tiết và giữ nguyên dữ liệu cũ.
- **Hiệu năng khi render danh sách lớn**: Nếu danh sách task lớn có thể gây giật lag UI. *Giải pháp*: Tối ưu hóa việc render DOM (chỉ re-render phần Kanban board thay vì toàn bộ ứng dụng mỗi khi state thay đổi nhẹ).
