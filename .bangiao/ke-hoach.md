Dưới đây là kế hoạch chi tiết triển khai web app **"NEXUS OS"** theo đúng các yêu cầu được giao. Kế hoạch này được chuẩn bị để Agent Coder có thể thực hiện trực tiếp.

---

### 1. Mục tiêu
Xây dựng một ứng dụng web quản lý công việc hiện đại có tên **"NEXUS OS"** hoàn toàn bằng HTML5, CSS3 và Vanilla JavaScript (không dùng framework, không dùng backend/API), chạy trên trình duyệt với các tính năng:
- Giao diện Dashboard, Tasks, Analytics, Settings kèm hỗ trợ Dark/Light mode và Compact/Comfortable layout.
- Quản lý Task toàn diện (CRUD, Priority, Status, Deadline, Search, Filter, Sort, Drag & Drop).
- Hệ thống Undo/Redo (hỗ trợ phím tắt Ctrl+Z / Ctrl+Y và lịch sử thao tác).
- Command Palette (mở bằng `Ctrl+K`).
- Import / Export dữ liệu JSON (có validate, không crash app).
- Lưu trữ dữ liệu và cài đặt qua `localStorage`.
- Tính năng PWA cơ bản (`manifest.json` và `service-worker.js` hoạt động offline).
- Đảm bảo tính năng Accessibility (A11y) và hiệu năng mượt mà.

---

### 2. Các file cần tạo / thay đổi
Toàn bộ là các file mới cần khởi tạo ở thư mục gốc của project:
1. `index.html` — Khung giao diện chính, cấu trúc các trang (Dashboard, Tasks, Analytics, Settings), Command Palette modal, dialog xác nhận.
2. `style.css` — Toàn bộ định dạng giao diện, biến màu (CSS variables) cho Dark/Light mode, layout compact/comfortable, animation, responsive styles, drag & drop states.
3. `script.js` — Logic toàn bộ ứng dụng (Quản lý State, LocalStorage, Task Manager, Drag & Drop, Undo/Redo history, Command Palette, Filter/Sort/Search, Analytics, Settings, Event Listeners).
4. `manifest.json` — Cấu hình Progressive Web App.
5. `service-worker.js` — Service worker hỗ trợ caching và offline mode cơ bản.

---

### 3. Các bước thực hiện chi tiết cho Coder

#### Bước 1: Khởi tạo cấu trúc HTML (`index.html`)
- Xây dựng layout chuẩn gồm:
  - **Sidebar Navigation**: Chuyển đổi giữa các tab (Dashboard, Tasks, Analytics, Settings).
  - **Main Content Area**: Chứa các view tương ứng ẩn/hiện bằng class CSS (`.view`).
  - **Command Palette Modal**: Overlay tìm kiếm và thực hiện nhanh lệnh (`Ctrl+K`).
  - **Notification/Toast Container**: Hiển thị thông báo thành công/lỗi.
  - **Confirmation Dialog**: Dùng cho hành động Clear All hoặc xóa quan trọng.
- Đảm bảo các button có `aria-label` và semantic HTML đúng chuẩn Accessibility.

#### Bước 2: Thiết kế giao diện & Theme (`style.css`)
- Định nghĩa hệ thống biến màu `:root` cho Light mode và `[data-theme="dark"]` cho Dark mode.
- Cấu hình layout linh hoạt (Flexbox/Grid), hỗ trợ responsive cho mobile và desktop.
- Thiết kế trạng thái cho Layout Compact (`--spacing-tight`) và Comfortable (`--spacing-relaxed`).
- Style cho Drag & Drop (hiệu ứng kéo thả, drop zone, ghost element).
- Tùy chỉnh animation nhẹ nhàng, hỗ trợ tắt animation khi setting được bật (`[data-animations="off"]`).

#### Bước 3: Phát triển logic ứng dụng (`script.js`)
Chia module logic trong file `script.js` rõ ràng:
1. **State Management & LocalStorage**:
   - Khởi tạo state mặc định (tasks, settings, history cho undo/redo).
   - Hàm `saveState()` và `loadState()`.
2. **Task CRUD & Validation**:
   - Tạo/Sửa/Xóa task với validation (không để trống title, deadline hợp lệ).
   - Đánh dấu hoàn thành, đổi status/priority.
3. **Search, Filter & Sort**:
   - Tìm kiếm theo từ khóa.
   - Lọc theo `status` (Todo, In Progress, Done) và `priority` (Low, Medium, High).
   - Sắp xếp theo Deadline hoặc Priority.
4. **Drag & Drop**:
   - HTML5 Drag and Drop API cho phép kéo task giữa các cột trạng thái (Todo, In Progress, Done).
5. **Undo / Redo System**:
   - Lưu trữ mảng lịch sử state trước đó (giới hạn tối đa 20 bước).
   - Bắt sự kiện bàn phím `Ctrl+Z` (Undo) và `Ctrl+Y` / `Ctrl+Shift+Z` (Redo).
6. **Command Palette (`Ctrl+K`)**:
   - Lắng nghe sự kiện `Ctrl+K` để mở modal, `ESC` để đóng.
   - Danh sách lệnh thực thi nhanh: Create task, Search task, Toggle theme, Export data, Clear completed.
7. **Import / Export**:
   - Export dữ liệu thành file `.json`.
   - Import file JSON, kiểm tra cấu trúc dữ liệu hợp lệ, thông báo lỗi nếu sai định dạng mà không làm crash trang.
8. **Analytics Engine**:
   - Tính toán động tổng số task, số lượng theo status, số lượng task quá hạn, high priority từ state thực tế.
   - Vẽ biểu đồ thống kê đơn giản bằng HTML/CSS/JS thuần.
9. **Settings Handler**:
   - Thay đổi Theme (Dark/Light), Layout (Compact/Comfortable), Animation (On/Off) và lưu ngay vào `localStorage`.

#### Bước 4: Cấu hình PWA (`manifest.json` & `service-worker.js`)
- **`manifest.json`**: Khai báo tên, short_name, icons, start_url, display (`standalone`), background_color, theme_color.
- **`service-worker.js`**: Cài đặt sự kiện `install` (cache các file tĩnh `index.html`, `style.css`, `script.js`, `manifest.json`) và sự kiện `fetch` phục vụ offline mode. Bọc trong try/catch hoặc kiểm tra `navigator.serviceWorker` để không làm crash trang nếu môi trường không hỗ trợ.

---

### 4. Cách kiểm tra (Dành cho Tester)
Tester sẽ kiểm tra dựa trên danh sách sau:
1. **File tồn tại**: Kiểm tra đủ 5 file (`index.html`, `style.css`, `script.js`, `manifest.json`, `service-worker.js`).
2. **Giao diện & Theme**: Chuyển đổi qua lại giữa Dark/Light mode, Compact/Comfortable layout, bật/tắt animation.
3. **Task Manager**:
   - Thêm task mới (test validation task rỗng / deadline không hợp lệ).
   - Sửa, Xóa, Đánh dấu hoàn thành.
   - Drag & drop task giữa các cột trạng thái.
   - Tìm kiếm, lọc theo status/priority, sắp xếp.
4. **Undo / Redo**: Thực hiện thao tác task, bấm `Ctrl+Z` để Undo và `Ctrl+Y` để Redo.
5. **Command Palette**: Bấm `Ctrl+K`, thử chạy các lệnh, bấm `ESC` để đóng.
6. **Import / Export**: Export ra file JSON, thử Import file JSON hợp lệ và file JSON sai định dạng (xem có báo lỗi và không crash app không).
7. **LocalStorage**: Thêm task, reload trang xem dữ liệu có còn giữ nguyên không. Nút Clear All có popup xác nhận.
8. **Analytics**: Kiểm tra số liệu trên trang Analytics phản ánh đúng thực tế task.
9. **PWA / Offline**: Kiểm tra service worker đăng ký thành công.

---

### 5. Rủi ro & Giải pháp
- **Rủi ro**: Lỗi khi parse file JSON import gây crash ứng dụng.
  - *Giải pháp*: Dùng `try...catch` khi `JSON.parse` và kiểm tra cấu trúc mảng/thuộc tính bắt buộc của task trước khi nạp vào state.
- **Rủi ro**: Xung đột sự kiện Drag & Drop trên các thiết bị di động.
  - *Giải pháp*: Kết hợp xử lý click/touch chuyển đổi status linh hoạt bên cạnh drag & drop cho mobile.
- **Rủi ro**: Lỗi vòng lặp vô hạn trong State History (Undo/Redo).
  - *Giải pháp*: Giới hạn kích thước lịch sử (max history length = 20) và chỉ ghi lịch sử khi state thực sự thay đổi qua các hành động rõ ràng.
