Dưới đây là kế hoạch triển khai chi tiết cho yêu cầu **"OMEGA SINGULARITY: THE IMPOSSIBILITY / BEYOND-HUMAN AGENT TEST"**. 

Theo đúng quy trình, thư mục `.bangiao` đã được kiểm tra/tạo và file `.bangiao/ke-hoach.md` sẽ được thiết lập với nội dung phân tích toàn diện.

---

# KẾ HOẠCH TRIỂN KHAI: OMEGA SINGULARITY & BEYOND-HUMAN AGENT TEST

## ⚠️ CÂU HỎI CÒN BỎ NGỎ (QUAN TRỌNG)
1. **Phần X & Y (Bất khả thi về mặt lý thuyết toán học - Bài toán dừng Halting Problem):** Yêu cầu quyết định chính xác 100% liệu một chương trình JavaScript tùy ý có dừng hay không, hoặc chứng minh không có bug/lỗ hổng bảo mật trên mọi input. **Planner khẳng định theo Định lý Halting (Alan Turing) và Định lý Không đầy đủ (Gödel), việc này là BẤT KHẢ THI về mặt toán học.** Kế hoạch sẽ không giả vờ cài đặt một thuật toán ma thuật giải quyết bài toán dừng, thay vào đó sẽ xây dựng một *Bounded Symbolic Execution / Heuristic Static Analyzer* kèm báo cáo giới hạn rõ ràng theo đúng tinh thần "HONEST LIMITATION REPORTING". Người dùng có đồng ý với cách tiếp cận này không?

---

## 1. Mục tiêu
- Xây dựng một bản thiết kế và cấu trúc mã nguồn mô phỏng Universal Web Runtime trong trình duyệt bao gồm 30 hệ thống con (từ Window Manager, Virtual FS, Transaction Engine đến Distributed Nodes, Spreadsheet, Sandbox, Plugin Security, Fuzzing, Model Checking và hệ thống tự chứng minh giới hạn).
- Tuân thủ tuyệt đối nguyên tắc **CORRECTNESS → VERIFIABILITY → SECURITY → CONSISTENCY → HONEST LIMITATION REPORTING**.
- Tuyệt đối không giả vờ đạt được các yêu cầu bất khả thi (Phần X & Y), mà phải chỉ ra bằng chứng toán học/lý thuyết về giới hạn của chúng.

---

## 2. Các file cần tạo / sửa (Đường dẫn chính xác)
Vì đây là một hệ thống quy mô cực lớn (Omega Singularity), mã nguồn sẽ được chia thành các module độc lập trong thư mục `src/`:

- `.bangiao/ke-hoach.md` (Tài liệu kế hoạch này)
- `src/runtime/kernel.js` (Core OS, Event Bus, Worker Pool)
- `src/vfs/filesystem.js` (Virtual File System với Journaling & Transaction)
- `src/transaction/engine.js` (Nested Transaction Engine: BEGIN, COMMIT, ROLLBACK)
- `src/distributed/nodes.js` (5 Virtual Nodes, Lamport/Vector Clock, Conflict Resolution)
- `src/query/engine.js` (Universal Query Parser & Executor, không dùng eval)
- `src/spreadsheet/engine.js` (1000x1000 cells, Formula parser, Circular dependency detection)
- `src/sandbox/js-sandbox.js` & `src/debugger/debugger.js` (JS Sandbox giới hạn & Debugger)
- `src/plugin/security.js` (Plugin System & Permission Enforcer)
- `src/search/universal-search.js` (Fuzzy Search cho 1,000,000+ records)
- `src/testing/fuzzer.js` & `src/testing/property-tests.js` (Fuzzing & Property-based testing)
- `src/verification/model-checker.js` & `src/verification/invariants.js` (State Machine, Invariant Checker I1-I7)
- `src/migration/migration-manager.js` (Migration chain v1 → v5)
- `src/limitation/impossibility-report.js` (**Phần X & Y**: Báo cáo trung thực về các giới hạn bất khả thi toán học như Bài toán dừng / Halting Problem).

---

## 3. Các bước thực hiện (Cho Coder)
1. **Khởi tạo cấu trúc thư mục** `src/` và các module cơ bản.
2. **Triển khai VFS & Transaction Engine:** Xây dựng hệ thống file ảo chống path traversal, hỗ trợ journaling và rollback khi crash.
3. **Mô phỏng Distributed System & Logical Clocks:** Tạo 5 node (A-E), đồng bộ qua Lamport/Vector Clocks và cơ chế giải quyết xung đột (Conflict Resolution).
4. **Xây dựng Query Parser & Spreadsheet:** Parser biểu thức an toàn (không dùng `eval`) và bộ tính toán bảng tính 1000x1000 với cơ chế phát hiện vòng lặp (circular dependency).
5. **Thiết lập Code Sandbox & Plugin Security:** Cô lập môi trường thực thi code, kiểm tra quyền hạn (permission enforcement) chống leo thang đặc quyền.
6. **Xây dựng Fuzzing, Property Testing & Invariants:** Kiểm tra các bất biến (I1-I7) qua Fuzzer và State Machine Model Checking.
7. **Lập Báo cáo Giới hạn (Impossibility & Halting Test):** Triển khai module `impossibility-report.js` để chứng minh và giải thích lý do tại sao các yêu cầu tuyệt đối (như phần X và Y) không thể giải quyết tổng quát, đưa ra phiên bản heuristic/bounded thực tế.

---

## 4. Cách kiểm tra (Verification & Testing)
- **Unit Tests & Integration Tests:** Kiểm tra từng engine (VFS, Transaction, Query, Spreadsheet).
- **Property-Based Tests:** Kiểm tra các property: Create→Delete, Apply→Undo, Serialize→Deserialize, Export→Import.
- **Crash Consistency Tests:** Mô phỏng ngắt quãng trong lúc write/commit để kiểm tra khả năng recover của Journaling VFS.
- **Meta-Test & Self-Correction Check:** Đảm bảo Test Runner không tự động đổi expected result để che giấu lỗi.
- **Honest Limitation Audit:** Kiểm tra báo cáo giới hạn ở Phần X & Y xem có giải thích chính xác bằng toán học/lý thuyết khoa học máy tính hay không.

---

## 5. Rủi ro (Risks)
- **Hiệu năng trình duyệt (Browser Performance):** Mô phỏng 1,000,000 records hoặc fuzzer chạy hàng loạt có thể gây tràn bộ nhớ (Out of Memory) hoặc đóng băng UI. *Giải pháp:* Sử dụng Web Worker Cluster (Phần O) để xử lý bất đồng bộ.
- **Hiểu lầm về yêu cầu tuyệt đối:** Các agent khác có thể cố viết code giả mạo giải quyết bài toán dừng (Halting Problem). *Giải pháp:* Cần giám sát chặt chẽ module `impossibility-report.js` để đảm bảo tuân thủ tính trung thực tuyệt đối (Honest Limitation Reporting).
