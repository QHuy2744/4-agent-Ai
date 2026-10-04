Chào bạn, tôi là **PLANNER**. Dựa trên yêu cầu tạo một web To-Do List hiện đại dành cho điện thoại Android (HTML, CSS, JS thuần, lưu bằng `localStorage`), tôi đã phân tích phạm vi công việc và lập kế hoạch triển khai chi tiết. 

Vì đây là một dự án mới (chưa có code sẵn trong thư mục), tôi xin gửi bản tóm tắt kế hoạch theo đúng định dạng yêu cầu.

---

### 1. Mục tiêu
- Xây dựng ứng dụng Web To-Do List giao diện mobile-first (tối ưu cho màn hình điện thoại Android).
- Các tính năng cốt lõi:
  - Ô nhập công việc mới (`input`) và nút **Thêm** (`button`).
  - Danh sách hiển thị công việc.
  - Đánh dấu hoàn thành (checkbox/click vào item).
  - Xóa công việc (nút xóa từng item).
  - Bộ lọc trạng thái: **Tất cả (All)**, **Đang làm (Active)**, **Đã xong (Completed)**.
  - Lưu trữ dữ liệu vĩnh viễn trên trình duyệt bằng `localStorage`.
- Giao diện hiện đại, trực quan, hỗ trợ responsive chuẩn mobile (bo góc, shadow nhẹ, màu sắc nổi bật, khoảng bấm ngón tay thuận tiện).

---

### 2. File cần thay đổi (Tạo mới)
Do đây là dự án khởi tạo từ đầu, chúng ta sẽ tạo cấu trúc 3 file chính tại thư mục gốc:
1. `index.html`: Khung cấu trúc HTML5, thiết lập viewport chuẩn mobile, liên kết CSS và JS.
2. `style.css`: Giao diện CSS hiện đại, tối ưu giao diện dạng khung điện thoại (mobile frame) hoặc full-width mobile, sử dụng Flexbox/Grid.
3. `app.js`: Xử lý toàn bộ logic ứng dụng (Thêm, Sửa/Hoàn thành, Xóa, Lọc, Đồng bộ `localStorage`, Render UI).

*(Lưu ý: Thư mục `.bangiao/` sẽ được tạo để chứa file `ke-hoach.md` chi tiết).*

---

### 3. Các bước thực hiện (cho Coder)
- **Bước 1**: Tạo thư mục `.bangiao` và file `.bangiao/ke-hoach.md` ghi nhận kế hoạch chi tiết.
- **Bước 2**: Xây dựng khung HTML (`index.html`) gồm:
  - Header tiêu đề ứng dụng.
  - Khu vực nhập liệu (Input + Nút Thêm).
  - Thanh bộ lọc (Tabs: Tất cả, Đang làm, Đã xong).
  - Khu vực hiển thị danh sách (`ul`/`div`) và trạng thái trống (empty state).
- **Bước 3**: Viết style cho CSS (`style.css`):
  - Thiết lập biến màu sắc (CSS Variables) hiện đại (ví dụ: Primary blue, background xám nhạt, màu chữ tối).
  - Bo tròn góc (border-radius), tạo hiệu ứng bóng (box-shadow), đảm bảo kích thước các nút bấm/checkbox đủ lớn để chạm bằng ngón tay (tối thiểu 44x44px).
  - Định dạng trạng thái hoàn thành (gạch ngang chữ, mờ đi).
- **Bước 4**: Viết logic JavaScript (`app.js`):
  - Khởi tạo mảng `todos` từ `localStorage` (hoặc mảng rỗng nếu chưa có).
  - Hàm `saveToLocalStorage()`: Lưu mảng `todos` vào `localStorage`.
  - Hàm `render()`: Vẽ lại danh sách công việc dựa trên bộ lọc hiện tại (current filter).
  - Sự kiện `submit`/`click` nút Thêm: Thêm task mới với ID thời gian (`Date.now()`), trạng thái `completed: false`.
  - Sự kiện `change`/`click` trên checkbox: Đổi trạng thái `completed`.
  - Sự kiện click nút Xóa: Xóa task khỏi mảng theo ID.
  - Sự kiện click các nút lọc: Thay đổi trạng thái filter và re-render.
- **Bước 5**: Kiểm tra thủ công các luồng tương tác và lưu trữ dữ liệu sau khi F5/reload trang.

---

### 4. Cách kiểm tra (Dành cho Tester)
- **Kiểm tra giao diện Mobile**: Mở trình duyệt, sử dụng chế độ Responsive Design (F12 -> Toggle Device Toolbar), chọn các dòng điện thoại Android (như Pixel, Samsung Galaxy) để kiểm tra giao diện có bị tràn viền hay khó bấm không.
- **Kiểm tra tính năng Thêm**: Nhập nội dung vào ô input, bấm nút Thêm (hoặc Enter) -> Công việc phải xuất hiện ở đầu hoặc cuối danh sách, ô input được clear.
- **Kiểm tra trạng thái Hoàn thành**: Click vào checkbox/item -> Chữ bị gạch ngang và chuyển sang tab "Đã xong" thì thấy nó ở đó.
- **Kiểm tra Bộ lọc**: Chuyển đổi giữa 3 tab (Tất cả / Đang làm / Đã xong) xem danh sách lọc có chính xác không.
- **Kiểm tra Xóa**: Bấm nút xóa -> Công việc biến mất khỏi danh sách.
- **Kiểm tra `localStorage`**: Thêm vài công việc, đánh dấu hoàn thành một vài cái, sau đó **Reload (F5) lại trang** -> Dữ liệu và trạng thái phải được giữ nguyên hoàn toàn.

---

### 5. Rủi ro
- **XSS (Cross-Site Scripting) khi render HTML**: Người dùng có thể nhập các ký tự đặc biệt hoặc mã độc vào ô input (ví dụ thẻ `<script>`). *Giải pháp*: Coder phải dùng `textContent` thay vì `innerHTML` khi hiển thị tiêu đề công việc để đảm bảo an toàn.
- **Tràn văn bản (Text Overflow)**: Nhập chuỗi quá dài không có khoảng trắng sẽ làm vỡ giao diện. *Giải pháp*: Sử dụng CSS `word-break: break-word` hoặc `overflow-wrap: break-word` cho thẻ chứa text công việc.
- **Dữ liệu trong `localStorage` bị hỏng/sai định dạng**: *Giải pháp*: Thêm khối `try...catch` khi gọi `JSON.parse()` dữ liệu từ `localStorage`.
