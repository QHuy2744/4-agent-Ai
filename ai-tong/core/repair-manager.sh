#!/data/data/com.termux/files/usr/bin/bash

BASE_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
AI_TONG="$BASE_DIR/ai-tong"

MAX_REPAIR=3

ERROR="$*"

if [ -z "$ERROR" ]; then
    echo "Cách dùng:"
    echo './ai-tong/core/repair-manager.sh "TESTER báo lỗi..."'
    exit 1
fi

echo "========================================"
echo "       AI TỔNG - REPAIR MANAGER"
echo "========================================"
echo
echo "Lỗi nhận được:"
echo "$ERROR"
echo

for ((ROUND=1; ROUND<=MAX_REPAIR; ROUND++)); do

    echo "----------------------------------------"
    echo "🔧 VÒNG SỬA LỖI: $ROUND/$MAX_REPAIR"
    echo "----------------------------------------"
    echo

    DEBUG_TASK=$(cat <<EOF
Một agent trong hệ thống AI đang gặp lỗi.

LỖI:

$ERROR

Bạn là DEBUGGER của AI TỔNG.

Hãy phân tích lỗi và trả về JSON duy nhất:

{
  "target_agent": "coder",
  "cause": "nguyên nhân lỗi",
  "fix": "cách sửa cụ thể",
  "retest": true
}

Quy tắc:
- target_agent phải là một trong:
  planner, coder, tester, reviewer
- Không được tự bịa agent khác.
- Nếu lỗi nằm ở code, ưu tiên coder.
- Nếu lỗi nằm ở kế hoạch, chọn planner.
- Nếu lỗi nằm ở kiểm thử, chọn tester.
- Nếu lỗi nằm ở đánh giá, chọn reviewer.
EOF
)

    DEBUG_RESULT=$(printf '%s' "$DEBUG_TASK" | "$BASE_DIR/ask-gemini.sh")

    echo "[DEBUGGER]"
    echo "$DEBUG_RESULT"
    echo

    TARGET=$(printf '%s' "$DEBUG_RESULT" | python -c '
import json
import sys

try:
    data = json.load(sys.stdin)
    print(data.get("target_agent", "coder"))
except:
    print("coder")
')

    FIX=$(printf '%s' "$DEBUG_RESULT" | python -c '
import json
import sys

try:
    data = json.load(sys.stdin)
    print(data.get("fix", "Hãy kiểm tra và sửa lỗi."))
except:
    print("Hãy kiểm tra và sửa lỗi.")
')

    echo "[AI TỔNG] Agent được giao sửa: $TARGET"
    echo "[AI TỔNG] Phương án:"
    echo "$FIX"
    echo

    REPAIR_TASK=$(cat <<EOF
AI TỔNG yêu cầu bạn sửa lỗi.

Lỗi:
$ERROR

Phương án DEBUGGER:
$FIX

Hãy thực hiện nhiệm vụ sửa lỗi phù hợp với vai trò của bạn.
EOF
)

    "$AI_TONG/core/dispatcher.sh" "$TARGET" "$REPAIR_TASK"

    STATUS=$?

    if [ "$STATUS" -eq 0 ]; then
        echo
        echo "✅ Agent $TARGET đã hoàn thành lượt sửa."
        echo
        echo "➡️ Cần TEST lại trước khi kết luận."
        exit 0
    fi

    echo
    echo "❌ Agent sửa lỗi thất bại."
    echo "➡️ AI TỔNG sẽ thử vòng tiếp theo..."
    echo

done

echo
echo "========================================"
echo "❌ REPAIR THẤT BẠI"
echo "========================================"
echo "Đã thử $MAX_REPAIR vòng."
exit 1
