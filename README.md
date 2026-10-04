# TaskForge - Web App Quản Lý Công Việc Cao Cấp

TaskForge là ứng dụng web quản lý công việc (Task Management Web App) cao cấp, chạy hoàn toàn phía client (Client-side), được thiết kế tối ưu cho cả thiết bị di động Android/iOS và màn hình Desktop.

## 🚀 Tính năng nổi bật

1. **Dashboard Thống kê Thời gian thực**: Tổng công việc, Đang làm, Hoàn thành, Quá hạn và thanh % tiến độ trực quan.
2. **Bảng Kanban 4 Cột**: Backlog, To Do, In Progress, Done.
3. **CRUD Công việc Đầy đủ**: Thêm, sửa, xóa với tiêu đề, mô tả, mức ưu tiên (Thấp, Trung bình, Cao, Khẩn cấp), deadline, và nhãn (tags).
4. **Kéo-Thả (Drag & Drop)**: Hỗ trợ HTML5 Drag & Drop trên Desktop và cơ chế di chuyển cột linh hoạt qua Modal trên thiết bị di động.
5. **Tìm kiếm & Bộ lọc nâng cao**: Tìm kiếm real-time theo từ khóa, bộ lọc đa điều kiện kết hợp (Trạng thái + Mức ưu tiên + Nhãn).
6. **Sắp xếp linh hoạt**: Theo Deadline, Mức ưu tiên, Ngày tạo (tăng/giảm dần).
7. **Hoàn tác / Làm lại (Undo / Redo)**: Hỗ trợ lịch sử thao tác với phím tắt `Ctrl+Z` và `Ctrl+Y` / `Ctrl+Shift+Z`.
8. **Lưu trữ Bền vững**: Dữ liệu được lưu trữ an toàn trong `localStorage` kèm cơ chế migration an toàn.
9. **Nhập / Xuất JSON**: Sao lưu và khôi phục dữ liệu qua file JSON có kiểm tra cấu trúc (schema validation).
10. **Dark Mode / Light Mode**: Chuyển đổi giao diện sáng/tối và ghi nhớ lựa chọn của người dùng.
11. **Giao diện Responsive & Mobile-First**: Tương thích xuất sắc trên mọi kích thước màn hình.
12. **Trải nghiệm người dùng cao cấp**: Toast notifications, Modal validation, Empty states rõ ràng.
13. **Phím tắt & Accessibility**: Hỗ trợ phím tắt (`N` để tạo task mới, `/` để tìm kiếm, `Esc` để đóng modal), điều hướng bàn phím chuẩn `aria-*`.

---

## 🛠️ Kiến trúc Thư mục

text
├── index.html          # Khung HTML chính & cấu trúc Modal/Toast
├── css/
│   └── styles.css      # Hệ thống biến CSS Variables, Dark/Light mode, Kanban grid
└── js/
    ├── app.js          # Khởi chạy ứng dụng (Entry point)
    ├── storage.js      # Quản lý localStorage & dữ liệu mẫu
    ├── state.js        # Quản lý trạng thái trung tâm & Stack Undo/Redo
    ├── tasks.js        # Logic CRUD, Tìm kiếm, Lọc, Sắp xếp
    ├── kanban.js       # Xử lý Kéo-thả (Desktop) & Hành động mobile
    ├── import-export.js# Xuất/Nhập JSON & Schema Validation
    ├── ui.js           # Giao diện, Dashboard stats, Toasts, Modals, Theme
    └── shortcuts.js    # Phím tắt & Trợ năng (Accessibility)


---

## 💻 Cách chạy ứng dụng

Vì ứng dụng hoàn toàn là **Vanilla HTML/CSS/JavaScript** và chạy phía client, bạn có thể chạy theo một trong các cách sau:

1. **Mở trực tiếp**: Nhấp đúp chuột vào file `index.html` hoặc kéo thả file `index.html` vào trình duyệt web bất kỳ (Chrome, Firefox, Safari, Edge).
2. **Chạy qua Local Server (Khuyên dùng)**:
   - Nếu bạn dùng Python:
     bash
     python3 -m http.server 8000
     
     Sau đó mở trình duyệt truy cập: `http://localhost:8000`
   - Hoặc sử dụng extension **Live Server** trong Visual Studio Code.

---

## ⌨️ Phím tắt hỗ trợ trên Desktop

- `N`: Mở modal tạo Task mới.
- `/`: Focus vào ô tìm kiếm.
- `Esc`: Đóng tất cả modal / panel đang mở.
- `Ctrl + Z`: Hoàn tác (Undo) thao tác gần nhất.
- `Ctrl + Y` (hoặc `Ctrl + Shift + Z`): Làm lại (Redo) thao tác.