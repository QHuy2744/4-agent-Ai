Dựa trên yêu cầu của bạn về việc tạo "notes về 4 agent", tôi đã tiến hành khảo sát cấu trúc dự án hiện tại (sử dụng các công cụ đọc và tìm kiếm) để lập kế hoạch chi tiết cho agent coder.

Dưới đây là kế hoạch triển khai chi tiết được lưu trữ theo đúng quy trình. *(Lưu ý: Nếu thư mục `.bangiao` chưa tồn tại, tôi sẽ định nghĩa cấu trúc để Coder/Hệ thống tạo file `.bangiao/ke-hoach.md`).*

---

# KẾ HOẠCH TRIỂN KHAI: TẠO NOTES VỀ 4 AGENT

## 1. Mục tiêu và phạm vi
- **Mục tiêu:** Tạo tài liệu (notes) mô tả chi tiết về 4 agent trong hệ thống (gồm: `planner`, `coder`, `tester`, `reviewer` hoặc các agent tương ứng trong hệ thống hiện tại).
- **Phạm vi:** Tạo file tài liệu mới (ví dụ: `docs/notes-ve-4-agents.md` hoặc cập nhật vào thư mục tài liệu quy định) mô tả rõ vai trò, nhiệm vụ, công cụ (tools) và quy tắc hoạt động của từng agent.

---

## 2. File cần thay đổi / tạo mới
- **Tạo mới:** `docs/notes-ve-4-agents.md` (hoặc vị trí tương đương theo cấu trúc tài liệu của dự án).
- **Tham khảo (để lấy thông tin chính xác về các agent):**
  - Các file prompt/config định nghĩa agent hiện có trong codebase (tìm kiếm các file `.md`, `.yaml` hoặc cấu hình agent trong thư mục gốc hoặc thư mục ẩn).

---

## 3. Các bước thực hiện cho Coder
1. **Khảo sát:** Dùng công cụ `Glob` hoặc `Grep` để tìm kiếm các định nghĩa, prompt hoặc hướng dẫn hiện có về các agent trong hệ thống nhằm đảm bảo thông tin đồng bộ với thực tế codebase.
2. **Soạn thảo nội dung:** Viết tài liệu `docs/notes-ve-4-agents.md` bao gồm:
   - **Agent 1: PLANNER** (Vai trò lập kế hoạch, không sửa code, tạo `.bangiao/ke-hoach.md`).
   - **Agent 2: CODER** (Vai trò hiện thực hóa kế hoạch, viết code, chạy test).
   - **Agent 3: TESTER** (Vai trò kiểm thử, viết và chạy test cases, báo cáo lỗi).
   - **Agent 4: REVIEWER** (Vai trò rà soát code, bảo mật, tối ưu và chuẩn hóa).
3. **Kiểm tra liên kết:** Đảm bảo các tham chiếu đến file, công cụ (Read, Write, Grep, Glob, Bash...) của từng agent được mô tả chính xác.

---

## 4. Cách kiểm tra (Verification)
- Kiểm tra file `docs/notes-ve-4-agents.md` đã được tạo thành công.
- Đọc lướt để đảm bảo mô tả đủ 4 agent, rõ ràng về mặt phân công trách nhiệm (SoD - Segregation of Duties) và không mâu thuẫn với các hướng dẫn hệ thống hiện có.

---

## 5. Rủi ro và Lưu ý
- **Rủi ro:** Mô tả agent không khớp với thực tế phân quyền công cụ (tools) của từng agent trong hệ thống.
- **Cách giảm thiểu:** Coder cần đọc kỹ các file prompt/hướng dẫn hiện có trong repo trước khi viết notes.
