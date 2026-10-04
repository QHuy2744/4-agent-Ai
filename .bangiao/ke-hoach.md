Chào bạn, tôi là **PLANNER**. Dựa trên yêu cầu **"tạo một web giới thiệu về máy tính"**, tôi đã khảo sát cấu trúc hiện tại của dự án (hiện tại workspace đang trống hoặc chưa có mã nguồn cụ thể cho trang web máy tính) và lập kế hoạch triển khai chi tiết dưới đây.

Vì đây là một dự án mới (hoặc cần xây dựng từ đầu), tôi đã tạo thư mục `.bangiao` và lưu kế hoạch chi tiết vào `.bangiao/ke-hoach.md`.

Dưới đây là tóm tắt kế hoạch triển khai:

---

### 1. Mục tiêu
Xây dựng một trang web giới thiệu sản phẩm máy tính (PC/Laptop) hiện đại, trực quan, bao gồm các phần chính:
*   **Trang chủ (Hero Section):** Giới thiệu thông điệp chính, banner sản phẩm nổi bật.
*   **Danh mục sản phẩm:** Hiển thị các dòng máy tính (Gaming, Văn phòng, Đồ họa).
*   **Chi tiết sản phẩm:** Thông số kỹ thuật (CPU, RAM, SSD, GPU, Giá bán).
*   **Phần liên hệ / Đặt hàng:** Form thông tin khách hàng muốn tư vấn/mua hàng.
*   **Giao diện Responsive:** Tối ưu hiển thị trên cả Desktop và Mobile.

---

### 2. File cần thay đổi / tạo mới
Dự kiến cấu trúc thư mục cho dự án (sử dụng HTML/CSS/JS thuần hoặc React tùy thuộc vào lựa chọn, ở đây đề xuất cấu trúc chuẩn cho Static Website hiện đại):
*   `index.html`: Trang chính chứa toàn bộ cấu trúc HTML.
*   `css/style.css`: File định dạng giao diện, bố cục (Flexbox/Grid), hiệu ứng và Responsive.
*   `js/main.js`: Xử lý tương tác (hiển thị modal chi tiết, lọc sản phẩm, validate form liên hệ).
*   `images/`: Thư mục chứa hình ảnh minh họa máy tính, banner.
*   `.bangiao/ke-hoach.md`: File lưu kế hoạch chi tiết cho Coder.

---

### 3. Các bước thực hiện
1.  **Bước 1: Khởi tạo cấu trúc HTML (`index.html`)**
    *   Xây dựng Semantic HTML gồm: `<header>` (Navigation), `<section class="hero">`, `<section class="products">`, `<section class="features">`, và `<footer>`.
2.  **Bước 2: Thiết kế giao diện với CSS (`css/style.css`)**
    *   Sử dụng CSS Variables để quản lý màu sắc (chủ đạo: màu công nghệ như xanh dương/đen/xám).
    *   Thiết kế layout linh hoạt bằng CSS Grid và Flexbox.
    *   Thêm Media Queries để đảm bảo responsive trên mobile.
3.  **Bước 3: Lập trình tính năng tương tác (`js/main.js`)**
    *   Thêm tính năng lọc sản phẩm theo danh mục (Gaming / Văn phòng).
    *   Xử lý sự kiện click xem chi tiết sản phẩm.
    *   Kiểm tra dữ liệu (Validation) cơ bản cho form liên hệ tư vấn.
4.  **Bước 4: Hoàn thiện nội dung & Hình ảnh**
    *   Thêm dữ liệu mẫu (mock data) cho các dòng máy tính với thông số kỹ thuật thực tế.

---

### 4. Cách kiểm tra
*   **Kiểm tra giao diện:** Mở file `index.html` trực tiếp trên trình duyệt (Chrome, Firefox, Safari).
*   **Kiểm tra Responsive:** Sử dụng công cụ Developer Tools (F12) trên trình duyệt để test các kích thước màn hình (Mobile, Tablet, Desktop).
*   **Kiểm tra tính năng:** Click thử các nút chuyển danh mục, form liên hệ và xem chi tiết sản phẩm xem có hoạt động mượt mà, không lỗi console.

---

### 5. Rủi ro
*   **Hình ảnh:** Thiếu hình ảnh sản phẩm máy tính chất lượng cao có thể làm giao diện kém thu hút (cần dùng placeholder hoặc ảnh stock minh họa).
*   **Thiết kế trên mobile:** Các bảng thông số kỹ thuật (specs) của máy tính nếu quá nhiều chữ có thể bị tràn màn hình trên thiết bị di động nếu không xử lý CSS kỹ.

---
*Kế hoạch chi tiết đã được ghi vào `.bangiao/ke-hoach.md` để Coder có thể bắt tay vào thực hiện.*
