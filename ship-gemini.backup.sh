#!/data/data/com.termux/files/usr/bin/bash

REQUEST="$*"

if [ -z "$REQUEST" ]; then
  echo "Cách dùng: ./ship-gemini.sh \"Yêu cầu cần làm\""
  exit 1
fi

mkdir -p .bangiao

echo "========================================"
echo "🤖 4-AGENT GEMINI PIPELINE"
echo "========================================"

echo ""
echo "🧠 [1/4] PLANNER đang lập kế hoạch..."

PLAN_PROMPT=$(cat planner.md)

./ask-gemini.sh "
Bạn đang đóng vai PLANNER trong hệ thống 4 Agent.

NHIỆM VỤ CỦA BẠN:
$PLAN_PROMPT

YÊU CẦU NGƯỜI DÙNG:
$REQUEST

Hãy phân tích codebase hiện tại và tạo kế hoạch chi tiết cho Coder.
Không được tự viết code.
Chỉ trả về kế hoạch rõ ràng, gồm:
1. Mục tiêu
2. Các file cần thay đổi
3. Các bước thực hiện
4. Cách kiểm tra
5. Các rủi ro/câu hỏi nếu có.
" > .bangiao/ke-hoach.md

if [ $? -ne 0 ]; then
  echo "❌ Planner thất bại."
  exit 1
fi

echo "✅ Planner hoàn thành."
echo "📄 Kế hoạch: .bangiao/ke-hoach.md"

echo ""
echo "🧑‍💻 [2/4] CODER đang phân tích kế hoạch..."

CODER_PROMPT=$(cat coder.md)
PLAN=$(cat .bangiao/ke-hoach.md)

./ask-gemini.sh "
Bạn đang đóng vai CODER trong hệ thống 4 Agent.

HƯỚNG DẪN CODER:
$CODER_PROMPT

YÊU CẦU GỐC:
$REQUEST

KẾ HOẠCH CỦA PLANNER:
$PLAN

Hãy phân tích codebase hiện tại và đề xuất chính xác các thay đổi cần thực hiện.

QUAN TRỌNG:
- Chưa được tự ý sửa file.
- Trả về danh sách file cần sửa.
- Với mỗi file, mô tả thay đổi cần thực hiện.
- Nếu có code mới, đưa code trong block rõ ràng.
" > .bangiao/thay-doi.md

if [ $? -ne 0 ]; then
  echo "❌ Coder thất bại."
  exit 1
fi

echo "✅ Coder hoàn thành."
echo "📄 Đề xuất thay đổi: .bangiao/thay-doi.md"

echo ""
echo "🧪 [3/4] TESTER đang kiểm tra..."

TESTER_PROMPT=$(cat tester.md)
CHANGES=$(cat .bangiao/thay-doi.md)

./ask-gemini.sh "
Bạn đang đóng vai TESTER trong hệ thống 4 Agent.

HƯỚNG DẪN TESTER:
$TESTER_PROMPT

YÊU CẦU GỐC:
$REQUEST

KẾ HOẠCH:
$PLAN

ĐỀ XUẤT THAY ĐỔI:
$CHANGES

Hãy kiểm tra logic của đề xuất và lập kế hoạch test.
Chưa được sửa code.
Trả về:
1. Test cần chạy
2. Kết quả mong đợi
3. Các lỗi/rủi ro có thể xảy ra
4. PASS hoặc FAIL nếu có đủ thông tin.
" > .bangiao/ket-qua-test.md

if [ $? -ne 0 ]; then
  echo "❌ Tester thất bại."
  exit 1
fi

echo "✅ Tester hoàn thành."
echo "📄 Kết quả test: .bangiao/ket-qua-test.md"

echo ""
echo "🔎 [4/4] REVIEWER đang phán quyết..."

REVIEWER_PROMPT=$(cat reviewer.md)
TEST_RESULT=$(cat .bangiao/ket-qua-test.md)

./ask-gemini.sh "
Bạn đang đóng vai REVIEWER trong hệ thống 4 Agent.

HƯỚNG DẪN REVIEWER:
$REVIEWER_PROMPT

YÊU CẦU GỐC:
$REQUEST

KẾ HOẠCH:
$PLAN

THAY ĐỔI:
$CHANGES

KẾT QUẢ TEST:
$TEST_RESULT

Hãy review toàn bộ quy trình.

Cuối cùng BẮT BUỘC đưa ra đúng một trong ba quyết định:

PHAN QUYET: CHOT

hoặc

PHAN QUYET: CAN SUA

hoặc

PHAN QUYET: CHAN

Sau quyết định, giải thích ngắn gọn lý do.
" > .bangiao/danh-gia.md

if [ $? -ne 0 ]; then
  echo "❌ Reviewer thất bại."
  exit 1
fi

echo "✅ Reviewer hoàn thành."
echo ""
echo "========================================"
echo "🏁 PIPELINE HOÀN TẤT"
echo "========================================"
echo ""
cat .bangiao/danh-gia.md
echo ""
echo "📁 Các file bàn giao nằm trong .bangiao/"
