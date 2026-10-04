#!/data/data/com.termux/files/usr/bin/bash
REQUEST="$*"
MAX_FIX=3
if [ -z "$REQUEST" ]; then
  echo "Cách dùng: ./ship-gemini.sh \"Yêu cầu cần làm\""
  exit 1
fi

mkdir -p .bangiao

echo "========================================"
echo "🤖 4-AGENT GEMINI AUTO-FIX PIPELINE"
echo "========================================"

echo ""
echo "🧹 Dọn file bàn giao cũ..."

rm -f \
  .bangiao/ke-hoach.md \
  .bangiao/thay-doi.patch \
  .bangiao/ket-qua-test.md \
  .bangiao/danh-gia.md \
  .bangiao/loi.md

echo ""
echo "🧠 [1/4] PLANNER..."

PLAN_PROMPT=$(cat planner.md)

./ask-gemini.sh "
Bạn là PLANNER.

HƯỚNG DẪN:
$PLAN_PROMPT

YÊU CẦU:
$REQUEST

Hãy phân tích codebase hiện tại và lập kế hoạch chi tiết.
Không sửa code.

Trả về:
1. Mục tiêu
2. File cần thay đổi
3. Các bước thực hiện
4. Cách kiểm tra
5. Rủi ro.
" > .bangiao/ke-hoach.md

if [ $? -ne 0 ]; then
  echo "❌ Planner thất bại."
  exit 1
fi

echo "✅ Planner xong."

PLAN=$(cat .bangiao/ke-hoach.md)

echo ""
echo "========================================"
echo "🔄 BẮT ĐẦU VÒNG TỰ SỬA"
echo "========================================"

FIX=0

while [ $FIX -lt $MAX_FIX ]; do

  echo ""
  echo "----------------------------------------"
  echo "🔧 VÒNG $((FIX + 1))/$MAX_FIX"
  echo "----------------------------------------"

  echo ""
  echo "🧑‍💻 [2/4] CODER tạo patch..."

  if [ -f .bangiao/loi.md ]; then
    ERROR_INFO=$(cat .bangiao/loi.md)
  else
    ERROR_INFO="Chưa có lỗi. Đây là lần đầu thực hiện."
  fi

  GIT_STATUS=$(git status --short)
  TRACKED_FILES=$(git ls-files)

  CODER_PROMPT=$(cat coder.md)

  ./ask-gemini.sh "
Bạn là CODER trong hệ thống 4 Agent.

HƯỚNG DẪN CODER:
$CODER_PROMPT

YÊU CẦU GỐC:
$REQUEST

KẾ HOẠCH:
$PLAN

TRẠNG THÁI GIT HIỆN TẠI:
$GIT_STATUS

CÁC FILE ĐANG ĐƯỢC GIT THEO DÕI:
$TRACKED_FILES

LỖI TỪ VÒNG TRƯỚC:
$ERROR_INFO

Hãy tạo unified diff để thực hiện yêu cầu.

QUY TẮC CỰC KỲ QUAN TRỌNG:
- Phải dựa trên trạng thái Git ở trên.
- Nếu file đã tồn tại hoặc đã được Git theo dõi thì TUYỆT ĐỐI KHÔNG dùng:
  new file mode
  /dev/null
  index 0000000
- Chỉ dùng diff --git cho file thực sự cần sửa.
- Không được tạo lại README.md nếu README.md đã tồn tại.
- Patch phải hoàn chỉnh từ đầu đến cuối.
- Không được cắt patch giữa chừng.
- Chỉ trả về nội dung unified diff.
- Không dùng markdown fence như \`\`\`diff.
- Không giải thích bên ngoài patch.
" > .bangiao/thay-doi.patch

  # Gemini đôi khi vẫn thêm markdown fence.
  sed -i '/^```diff$/d; /^```$/d' .bangiao/thay-doi.patch

  echo "🔍 Kiểm tra patch..."

  if ! git apply --check .bangiao/thay-doi.patch 2> .bangiao/loi-patch.md; then
    echo "❌ Patch không hợp lệ."

    cat .bangiao/loi-patch.md > .bangiao/loi.md

    FIX=$((FIX + 1))
    continue
  fi

  echo "✅ Patch hợp lệ."

  echo ""
  echo "🧪 [3/4] TESTER..."

  TESTER_PROMPT=$(cat tester.md)

  ./ask-gemini.sh "
Bạn là TESTER.

HƯỚNG DẪN:
$TESTER_PROMPT

YÊU CẦU:
$REQUEST

KẾ HOẠCH:
$PLAN

PATCH:
$(cat .bangiao/thay-doi.patch)

Hãy kiểm tra patch thật kỹ.

Kiểm tra:
- Logic
- Syntax
- File có phù hợp không
- Có lỗi rõ ràng không
- Có thiếu bước nào không
- Có gây breaking change không

Cuối cùng bắt buộc trả về:

TEST_RESULT: PASS

hoặc

TEST_RESULT: FAIL

Nếu FAIL, liệt kê lỗi thật cụ thể để Coder có thể sửa.
" > .bangiao/ket-qua-test.md

  cat .bangiao/ket-qua-test.md

  if grep -q "TEST_RESULT: PASS" .bangiao/ket-qua-test.md; then
    echo ""
    echo "✅ Tester PASS."
    break
  fi

  echo ""
  echo "❌ Tester phát hiện lỗi."
  echo "🔁 Gửi lỗi ngược lại cho Coder..."

  cat .bangiao/ket-qua-test.md > .bangiao/loi.md

  FIX=$((FIX + 1))
done

if ! grep -q "TEST_RESULT: PASS" .bangiao/ket-qua-test.md 2>/dev/null; then
  echo ""
  echo "========================================"
  echo "🛑 AUTO-FIX DỪNG"
  echo "========================================"
  echo ""
  echo "Đã thử tối đa $MAX_FIX vòng."
  echo ""
  echo "Lỗi cuối cùng:"
  cat .bangiao/loi.md 2>/dev/null
  exit 1
fi

echo ""
echo "========================================"
echo "🔎 [4/4] REVIEWER"
echo "========================================"

REVIEWER_PROMPT=$(cat reviewer.md)

./ask-gemini.sh "
Bạn là REVIEWER cuối cùng.

HƯỚNG DẪN:
$REVIEWER_PROMPT

YÊU CẦU:
$REQUEST

KẾ HOẠCH:
$PLAN

PATCH:
$(cat .bangiao/thay-doi.patch)

KẾT QUẢ TEST:
$(cat .bangiao/ket-qua-test.md)

Hãy review toàn bộ thay đổi.

Cuối cùng BẮT BUỘC chọn đúng một:

PHAN QUYET: CHOT

hoặc

PHAN QUYET: CAN SUA

hoặc

PHAN QUYET: CHAN

Giải thích ngắn gọn sau quyết định.
" > .bangiao/danh-gia.md

cat .bangiao/danh-gia.md

echo ""
echo "========================================"

if grep -q "PHAN QUYET: CHOT" .bangiao/danh-gia.md; then

  echo "✅ REVIEWER: CHOT"
  echo ""
  echo "📦 Áp dụng patch..."

  if git apply .bangiao/thay-doi.patch; then
    echo ""
    echo "🎉 THAY ĐỔI ĐÃ ĐƯỢC ÁP DỤNG."
  else
    echo ""
    echo "❌ Không thể áp dụng patch."
    exit 1
  fi

elif grep -q "PHAN QUYET: CAN SUA" .bangiao/danh-gia.md; then

  echo "⚠️ REVIEWER: CAN SUA"
  echo "Patch chưa được áp dụng."

elif grep -q "PHAN QUYET: CHAN" .bangiao/danh-gia.md; then

  echo "🛑 REVIEWER: CHAN"
  echo "Patch chưa được áp dụng."

else

  echo "⚠️ Reviewer không đưa ra quyết định hợp lệ."
  echo "Patch chưa được áp dụng."

fi

echo ""
echo "========================================"
echo "🏁 PIPELINE HOÀN TẤT"
echo "========================================"
echo ""
echo "📁 File bàn giao:"
echo "  .bangiao/ke-hoach.md"
echo "  .bangiao/thay-doi.patch"
echo "  .bangiao/ket-qua-test.md"
echo "  .bangiao/danh-gia.md"
echo ""
