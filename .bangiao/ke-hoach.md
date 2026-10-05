*(Bắt đầu thực thi vai trò PLANNER)*

### 1. Phân tích hiện trạng & Mục tiêu
- **Mục tiêu:** Xây dựng hoàn chỉnh web game "AI THÁM TỬ — DETECTIVE CASE" chạy trên 1 file HTML, 1 file CSS, 1 file JS chính (hoặc cấu trúc module rõ ràng không phụ thuộc backend), đáp ứng giao diện Dark Detective mobile-first, có tối thiểu 3 vụ án, đầy đủ hệ thống Manh mối, Nghi phạm, Timeline, Thẩm vấn, Phát hiện mâu thuẫn, Ghi chú, Kết luận, Chấm điểm, Thành tích, Lưu trữ localStorage và Âm thanh bằng Web Audio API.
- **Phạm vi:** Tạo mới/cấu trúc các file cốt lõi `index.html`, `style.css`, `script.js` tại thư mục gốc của project (hoặc kiểm tra codebase hiện có trước khi ghi).

---

### 2. Các file cần tạo / sửa (Đường dẫn chính xác)
- `index.html` (Tạo mới / Cập nhật): Chứa cấu trúc HTML5 chuẩn, mobile-first, semantic tags, các màn hình (Home, Vụ án, Manh mối, Nghi phạm, Timeline, Thẩm vấn, Kết luận, Thành tích, Hướng dẫn, Cài đặt) và ARIA labels hỗ trợ accessibility.
- `style.css` (Tạo mới / Cập nhật): Thiết kế theo phong cách Dark Detective (nền tối `#0f172a`, chữ sáng, đỏ cảnh báo `#ef4444`, vàng vật chứng `#f59e0b`, xanh hệ thống `#3b82f6`), responsive hoàn hảo từ 320px đến desktop, hỗ trợ `prefers-reduced-motion`.
- `script.js` (Tạo mới / Cập nhật): Quản lý toàn bộ game state, dữ liệu 3 vụ án mẫu, hệ thống LocalStorage, Web Audio API sound effects, logic thẩm vấn, phát hiện mâu thuẫn, chấm điểm và điều hướng màn hình.
- `.bangiao/ke-hoach.md` (Tạo mới): Ghi nhận chi tiết kế hoạch triển khai cho Coder.

---

### 3. Các bước thực hiện (Cho Coder)
1. **Kiểm tra môi trường:** Đọc các file hiện có bằng công cụ `Read`, `Glob` để nắm cấu trúc thư mục hiện tại.
2. **Khởi tạo thư mục `.bangiao`:** Tạo thư mục `.bangiao` nếu chưa có và ghi file `.bangiao/ke-hoach.md`.
3. **Triển khai `index.html`:** Xây dựng khung giao diện SPA (Single Page Application) với các tab điều hướng di động (bottom nav trên mobile, sidebar trên desktop) và các modal/màn hình chức năng.
4. **Triển khai `style.css`:** Viết CSS thuần, tối ưu mobile-first, tuân thủ bảng màu Dark Detective, xử lý responsive không tràn màn hình (`overflow-x: hidden`).
5. **Triển khai `script.js`:**
   - Định nghĩa dữ liệu 3 vụ án (`CASES` với đầy đủ nạn nhân, nghi phạm, manh mối, timeline, lời khai, lời giải).
   - Xây dựng state management (`gameState`) và các hàm CRUD với `localStorage`.
   - Viết các hàm logic game: Khám phá manh mối, Thẩm vấn nghi phạm, Đối chiếu mâu thuẫn (Contradiction detection), Tính điểm Suspicion, Tạo/Sửa/Xóa Notes, Hệ thống Achievements, Timer, và Web Audio API sound effects.
6. **Kiểm tra bảo mật & hiệu năng:** Đảm bảo không dùng `eval()`, sử dụng `textContent` để chống XSS, tối ưu DOM rendering.

---

### 4. Cách kiểm tra (Dành cho Tester)
Tester tiến hành chạy qua 15 test cases yêu cầu (TEST 1 đến TEST 15):
- Load website, bắt đầu vụ án, mở hồ sơ nghi phạm, khám phá manh mối, mở evidence board, xem timeline, thẩm vấn nghi phạm, phát hiện mâu thuẫn, tạo ghi chú, reload trang kiểm tra save/load, submit deduction sai/đúng, kiểm tra tính điểm, reset case và reset toàn bộ dữ liệu.
- Kiểm traresponsive layout trên mobile (320px, 375px) và desktop.

---

### 5. Rủi ro & Giải pháp
- **Rủi ro 1:** Tràn giao diện (horizontal overflow) trên màn hình nhỏ 320px.
  - *Giải pháp:* Dùng CSS Grid/Flexbox với `max-width: 100%`, `box-sizing: border-box` và ẩn các thành phần phụ trên mobile.
- **Rủi ro 2:** Mất dữ liệu khi reload trang.
  - *Giải pháp:* Tự động gọi `saveGame()` ở mọi thay đổi state quan trọng và load ngay khi khởi động (`DOMContentLoaded`).
- **Rủi ro 3:** Lỗi logic mâu thuẫn giữa lời khai và timeline.
  - *Giải pháp:* Định nghĩa rõ ràng cặp `suspectId`, `statementId` và `clueId/timelineId` tương ứng trong dữ liệu từng case.

---
*(Kế hoạch đã sẵn sàng. Không có câu hỏi nào bỏ ngỏ. Chuyển giao cho Coder triển khai.)*
