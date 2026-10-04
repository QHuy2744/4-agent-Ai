---
description: Chạy dây chuyền bốn agent cho một yêu cầu tính năng và dừng ngay khi có chặn.
---

Chạy dây chuyền bốn agent cho yêu cầu sau:
$ARGUMENTS

Tuân thủ đúng thứ tự, không bỏ qua chặng.

0. Kiểm tra branch hiện tại bằng lệnh đọc an toàn. Nếu branch là `main` hoặc `master`, DỪNG và báo người dùng. Không được chạy dây chuyền trên branch chính.

1. Dọn các file bàn giao cũ trong `.bangiao/` nếu có: `ke-hoach.md`, `thay-doi.md`, `ket-qua-test.md`, `danh-gia.md`.
2. Giao yêu cầu cho subagent `planner`. Chờ `.bangiao/ke-hoach.md` được tạo.
3. Đọc kế hoạch. Nếu có `CÂU HỎI CÒN BỎ NGỎ`, DỪNG và đưa toàn bộ câu hỏi cho người dùng.
4. Nếu kế hoạch rõ, giao cho subagent `coder`. Chờ `.bangiao/thay-doi.md`.
5. Giao cho subagent `tester`. Chờ `.bangiao/ket-qua-test.md`.
6. Nếu kết quả test có lỗi/rớt, DỪNG và báo đúng phần lỗi; không tự lách qua chặng Reviewer.
7. Nếu test xanh, giao cho subagent `reviewer`. Chờ `.bangiao/danh-gia.md`.
8. Hiển thị phán quyết cuối cùng cho người dùng.

Quy tắc an toàn:
- Không tự merge branch.
- Không tự push.
- Không tạo pull request.
- Không bỏ qua Planner/Tester/Reviewer.
- Không dùng file bàn giao của lần chạy trước.
