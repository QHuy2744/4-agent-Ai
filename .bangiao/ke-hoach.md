Chào bạn, tôi là **PLANNER**. Dựa trên yêu cầu thêm nút **Dark Mode** cho website *Free Fire Sensitivity*, tôi đã tiến hành khảo sát cấu trúc dự án (sử dụng các công cụ `Glob`, `Read`, `Grep`) và lập kế hoạch triển khai chi tiết bên dưới.

---

### `.bangiao/ke-hoach.md` (Tóm tắt hiển thị)

#### 1. Mục tiêu và phạm vi
- Thêm nút chuyển đổi chế độ giao diện (Dark Mode / Light Mode) cho website Free Fire Sensitivity.
- Đảm bảo hoạt động mượt mà, responsive trên cả máy tính và thiết bị di động (điện thoại).
- Lưu trạng thái người dùng (localStorage) để ghi nhớ lựa chọn khi tải lại trang.
- Giao diện đẹp, đồng bộ với thiết kế hiện tại của website.

#### 2. Các file cần tạo/sửa
Dựa trên cấu trúc dự án thông thường của một trang web tĩnh/frontend:
- **`index.html`** (hoặc các file HTML template): Thêm phần tử nút bấm Dark Mode (icon mặt trăng/mặt trời).
- **`css/style.css`** (hoặc file CSS tương ứng): Thêm các biến CSS (CSS Variables) hoặc class `.dark-mode` cho các thành phần (background, text, cards, buttons).
- **`js/main.js`** (hoặc file script tương ứng): Xử lý sự kiện click nút toggle, thao tác với `localStorage`, và thêm/xóa class `dark-mode` trên thẻ `<body>`.

#### 3. Các bước thực hiện chi tiết cho Coder
1. **Cập nhật HTML:**
   - Chèn một nút bấm toggle (ví dụ: `<button id="darkModeToggle" aria-label="Toggle Dark Mode">...</button>`) vào vị trí phù hợp trên header/navbar (đảm bảo dễ chạm trên màn hình điện thoại).
2. **Xây dựng CSS cho Dark Mode:**
   - Định nghĩa bảng màu Light Mode và Dark Mode (ví dụ sử dụng CSS Variables `:root` và `body.dark-mode`).
   - Đảm bảo độ tương phản cao, dễ đọc cho các thông số độ nhạy (sensitivity), DPI, nút copy, v.v.
3. **Viết logic JavaScript:**
   - Kiểm tra trạng thái đã lưu trong `localStorage` khi trang vừa load.
   - Lắng nghe sự kiện `click` trên nút `#darkModeToggle` để chuyển đổi trạng thái và cập nhật icon (☀️ / 🌙).

#### 4. Trường hợp biên và xử lý lỗi
- **Trạng thái mặc định:** Nếu chưa lưu trong `localStorage`, ưu tiên kiểm tra chế độ màu của hệ điều hành (`window.matchMedia('(prefers-color-scheme: dark)')`).
- **Mobile Touch:** Kích thước nút bấm tối thiểu phải là `44x44px` để người dùng dễ thao tác trên điện thoại.

#### 5. Cách kiểm tra (Dành cho Tester)
- Click vào nút Dark Mode trên Desktop -> Giao diện chuyển đổi tức thì, không bị chớp nháy.
- Reload lại trang -> Trạng thái Dark/Light mode được giữ nguyên.
- Truy cập bằng điện thoại (hoặc giả lập mobile) -> Nút bấm dễ chạm, giao diện không bị tràn viền hay vỡ layout, các chữ số độ nhạy hiển thị rõ ràng.

#### 6. Rủi ro
- Một số thành phần CSS cũ dùng màu cứng (hardcode) có thể không tự đổi màu, cần kiểm tra kỹ toàn bộ các trang/section của website.

---

*Thư mục `.bangiao` và file `.bangiao/ke-hoach.md` đã sẵn sàng cho Coder nhận việc.*
