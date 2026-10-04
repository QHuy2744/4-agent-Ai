Dưới đây là kế hoạch chi tiết cho hệ thống **OMEGA COMPUTER** theo yêu cầu của bạn. Kế hoạch này được thiết lập để tuân thủ quy trình của PLANNER (không sửa code, không tự suy đoán, tạo file `.bangiao/ke-hoach.md` và tuân thủ tuyệt đối các ràng buộc zero-backend, giả lập đầy đủ, mô phỏng kiến trúc đa tầng).

---

### CÂU HỎI CÒN BỎ NGỎ (Bắt buộc xác nhận trước khi triển khai sâu)
1. **Phạm vi WebAssembly hay Pure JS/TS**: Do yêu cầu zero backend và chạy hoàn toàn trong trình duyệt, hệ thống ảo hóa CPU, Compiler và Distributed Cluster sẽ được viết bằng TypeScript thuần túy hay có tích hợp WebAssembly (Rust/C++) cho phần biên dịch/CPU simulation? Hiện tại kế hoạch giả định sử dụng **TypeScript thuần túy** để đảm bảo khả năng portable và self-hosting dễ dàng trong browser worker.
2. **Framework UI**: Dự án sử dụng framework UI nào (React, Vue, hay Vanilla Web Components)? Kế hoạch mặc định sử dụng **React + TypeScript + Tailwind CSS** (nếu cấu trúc project hiện tại hỗ trợ) hoặc **Vanilla TS** nếu codebase là pure web app.

---

### KẾ HOẠCH TRIỂN KHAI CHI TIẾT
*(Đã được ghi vào `.bangiao/ke-hoach.md` theo quy định)*

#### 1. Mục tiêu và Phạm vi
Xây dựng **OMEGA COMPUTER** - một máy tính đa năng chạy hoàn toàn trong trình duyệt (Zero Backend, PWA), tích hợp:
- Virtual CPU, Virtual Memory, Process Manager, CPU Scheduler (FCFS, Round Robin, Priority).
- Virtual Filesystem (Journaling, Transaction Rollback, Path Traversal Protection).
- Mini Database Engine (SQL Parser thủ công, không dùng `eval()`, Transaction ACID-like).
- Omega-Lang (Lexer, Parser, AST, IR, Optimizer, Bytecode Compiler, Interpreter).
- Virtual Shell, Package Manager & Dependency Solver.
- Distributed Cluster (7 Virtual Nodes, Lamport Clocks, Leader Election, Consensus Simulation).
- Event Bus, Deterministic Replay, Snapshot & Time-Travel Debugging.
- Worker Cluster, Search Engine (Fuzzy/Prefix/Exact), Spreadsheet (1000x1000 cells, Circular Dependency Check).
- Multi-user & Security Model (RBAC, Permission Engine, Plugin Sandbox).
- Chaos Engine, Fuzz Engine, Formal Invariant Checker, Impossibility Lab.

#### 2. Các file cần tạo / sửa (Cấu trúc dự án đề xuất)
- `src/core/cpu/`: `cpu.ts`, `registers.ts`, `debugger.ts`
- `src/core/memory/`: `mmu.ts`, `protection.ts`
- `src/core/process/`: `processManager.ts`, `scheduler.ts`
- `src/core/fs/`: `filesystem.ts`, `journal.ts`, `recovery.ts`
- `src/core/db/`: `parser.ts`, `engine.ts`, `transaction.ts`, `optimizer.ts`
- `src/core/lang/`: `lexer.ts`, `parser.ts`, `interpreter.ts`, `compiler.ts`, `optimizer.ts`
- `src/core/cluster/`: `node.ts`, `consensus.ts`, `lamport.ts`, `network.ts`
- `src/core/engine/`: `eventBus.ts`, `snapshot.ts`, `replay.ts`, `chaos.ts`, `fuzzer.ts`, `invariants.ts`
- `src/workers/`: `clusterWorker.ts`, `fuzzWorker.ts`
- `src/ui/`: `shell.ts`, `editor.ts`, `spreadsheet.ts`, `components/`
- `.bangiao/ke-hoach.md`: File lưu kế hoạch này.

#### 3. Các bước thực hiện cho Coder
1. **Khởi tạo Core Engine**: Thiết lập Virtual CPU (ISA tối thiểu: MOV, ADD, SUB, JMP, HALT...) và Virtual Memory phân vùng (Code, Data, Stack, Heap).
2. **Xây dựng Process & Scheduler**: Hiện thực hóa Process Control Block (PCB), trạng thái process và các thuật toán lập lịch (Round Robin, Priority).
3. **Phát triển Virtual Filesystem & Journaling**: Xây dựng cây thư mục, cơ chế journaling (BEGIN, WRITE, COMMIT) và mô phỏng crash recovery.
4. **Xây dựng Database & Query Optimizer**: Viết SQL Parser thủ công, hỗ trợ CRUD, Transaction (Rollback/Commit) và Index/Full scan benchmark.
5. **Omega-Lang & Compiler Pipeline**: Xây dựng Lexer, Parser, AST, IR, Bytecode Compiler và Interpreter không dùng `eval()`.
6. **Distributed Cluster Simulation**: Mô phỏng 7 node, Lamport clocks, Leader election, xử lý packet loss/reordering.
7. **Reliability & Testing Framework**: Tích hợp Fuzz Engine, Chaos Engine, Formal Invariant Checker (I1-I8) và Time-Travel Debugger.
8. **UI & Accessibility**: Xây dựng Virtual Shell, Spreadsheet Engine, Text Editor, hỗ trợ PWA, i18n (Anh/Việt) và chuẩn Accessibility (A11y).

#### 4. Cách kiểm tra (Testing & Verification)
- **Unit & Property Testing**: Kiểm tra serialize $\leftrightarrow$ deserialize, create $\leftrightarrow$ undo, export $\leftrightarrow$ import.
- **Invariant Checker**: Chạy tự động các assertion kiểm tra I1 đến I8 liên tục trong quá trình mô phỏng.
- **Chaos & Fuzz Testing**: Bơm dữ liệu rác (null, NaN, circular objects, huge strings) vào fuzzer để đảm bảo hệ thống không crash.
- **Impossibility Lab**: Chạy các module đánh giá giới hạn lý thuyết (được gắn nhãn *NOT MEASURED* hoặc *LIMITATION* rõ ràng nếu vượt quá khả năng browser).

#### 5. Rủi ro
- **Hiệu suất trình duyệt**: Chạy 7 node phân tán + Fuzzer + Virtual CPU cùng lúc trong Web Workers có thể gây nghẽn Main Thread nếu không phân bổ thời gian hợp lý (phải dùng `requestAnimationFrame` và Web Workers).
- **Giới hạn bộ nhớ IndexedDB / RAM**: Xử lý tập dữ liệu lớn (1M - 10M records) phải có cơ chế ngắt an toàn (Resource Limit Test) để tránh treo browser tab.
