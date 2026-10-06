#!/data/data/com.termux/files/usr/bin/bash

set -u

BASE_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
AI_TONG="$BASE_DIR/ai-tong"

TASK="$*"
MAX_ROUNDS=10

SYSTEM_PROMPT="$(cat "$AI_TONG/core/system-prompt.txt")"

if [ -z "$TASK" ]; then
    echo "Cách dùng:"
    echo './ai-tong/core/orchestrator.sh "Yêu cầu cần làm"'
    exit 1
fi

LOG="$AI_TONG/logs/orchestrator.log"
TASK_ID="$(date +%Y%m%d_%H%M%S)"
TASK_FILE="$AI_TONG/tasks/$TASK_ID.md"

mkdir -p "$AI_TONG/logs" "$AI_TONG/tasks"

cat > "$TASK_FILE" <<TASK_EOF
# AI TỔNG - TASK

**Task ID:** $TASK_ID

## Yêu cầu

$TASK

## Trạng thái

RUNNING
TASK_EOF

echo "========================================"
echo "       AI TỔNG - ORCHESTRATOR"
echo "========================================"
echo
echo "Task: $TASK"
echo "ID:   $TASK_ID"
echo "Max rounds: $MAX_ROUNDS"
echo

echo "[$(date)] CREATED $TASK_ID" >> "$LOG"

CURRENT_AGENT="planner"
CURRENT_RESULT="Chưa có kết quả. Đây là bước đầu tiên."
ROUND=0

while [ "$ROUND" -lt "$MAX_ROUNDS" ]; do

    ROUND=$((ROUND + 1))

    echo
    echo "========================================"
    echo "        🔄 VÒNG $ROUND/$MAX_ROUNDS"
    echo "========================================"
    echo
    echo "[AI TỔNG] Agent hiện tại: $CURRENT_AGENT"

    echo "[$(date)] ROUND $ROUND AGENT $CURRENT_AGENT" >> "$LOG"

    # ==================================================
    # TẠO NHIỆM VỤ CHO AGENT
    # ==================================================

    AGENT_TASK=$(cat <<TASK_EOF
Bạn là agent "$CURRENT_AGENT" trong hệ thống AI TỔNG.

Nhiệm vụ gốc của người dùng:

$TASK

Kết quả từ bước trước:

$CURRENT_RESULT

$SYSTEM_PROMPT

NHIỆM VỤ CỦA BẠN:

Hãy thực hiện đúng vai trò của agent "$CURRENT_AGENT".

Nếu bạn là PLANNER:
- Phân tích yêu cầu.
- Lập kế hoạch rõ ràng.
- Chỉ ra các bước triển khai.

Nếu bạn là CODER:
- Dựa trên yêu cầu và kết quả trước để đề xuất hoặc thực hiện phần code cần thiết.
- Không tự thêm tính năng ngoài yêu cầu.

Nếu bạn là TESTER:
- Kiểm tra kết quả.
- Tìm lỗi.
- Phải kết luận rõ PASS hoặc FAIL.

Nếu bạn là DEBUGGER:
- Phân tích lỗi.
- Xác định nguyên nhân.
- Xác định agent cần sửa.
- Đưa ra cách sửa cụ thể.

Nếu bạn là REVIEWER:
- Đánh giá toàn bộ kết quả.
- Kiểm tra yêu cầu ban đầu đã được đáp ứng chưa.
- Phải kết luận APPROVED hoặc REJECTED.

Hãy trả về kết quả rõ ràng, trung thực và phù hợp với vai trò.
TASK_EOF
)

    echo
    echo "[AI TỔNG] 🚀 Giao việc cho $CURRENT_AGENT..."
    echo

    if RESULT=$("$AI_TONG/core/dispatcher.sh" "$CURRENT_AGENT" "$AGENT_TASK"); then
        STATUS=0
    else
        STATUS=$?
    fi

    echo
    echo "----------------------------------------"
    echo "[AI TỔNG] Kết quả từ $CURRENT_AGENT:"
    echo "----------------------------------------"
    echo "$RESULT"
    echo

    if [ "$STATUS" -ne 0 ]; then
        echo "[AI TỔNG] ❌ Agent thực thi thất bại."

        echo "[$(date)] AGENT_FAILED $CURRENT_AGENT ROUND_$ROUND" >> "$LOG"

        CURRENT_RESULT="Agent $CURRENT_AGENT thực thi thất bại.

Kết quả/lỗi:
$RESULT"

        CURRENT_AGENT="debugger"
        continue
    fi

    echo "[$(date)] AGENT_SUCCESS $CURRENT_AGENT ROUND_$ROUND" >> "$LOG"

    # ==================================================
    # AI TỔNG PHÂN TÍCH KẾT QUẢ
    # ==================================================

    echo "[AI TỔNG] 🧠 Đang phân tích kết quả..."

    DECISION_PROMPT=$(cat <<DECISION_EOF
Bạn là AI TỔNG CHỈ HUY.

Nhiệm vụ gốc:

$TASK

Agent vừa chạy:

$CURRENT_AGENT

Kết quả:

$RESULT

Hãy quyết định bước tiếp theo.

QUY TẮC BẮT BUỘC:

1. PLANNER
Nếu nhiệm vụ cần triển khai:
→ CODER

Nếu người dùng chỉ yêu cầu lập kế hoạch:
→ DONE

2. CODER
Sau khi CODER hoàn thành:
→ TESTER

3. TESTER
Nếu TESTER phát hiện lỗi:
→ DEBUGGER

Nếu TESTER PASS:
→ REVIEWER

4. DEBUGGER
Sau khi DEBUGGER phân tích/sửa lỗi:
→ CODER

5. REVIEWER
Nếu APPROVED:
→ DONE

Nếu REJECTED:
→ DEBUGGER

Chỉ trả về JSON hợp lệ:

{
  "next_agent": "PLANNER|CODER|TESTER|REVIEWER|DEBUGGER",
  "action": "CONTINUE|RETEST|FIX|REVIEW|DONE|FAIL",
  "status": "RUNNING|PASS|FAIL|DONE",
  "reason": "lý do ngắn gọn"
}

Không markdown.
Không code fence.
Không giải thích ngoài JSON.
DECISION_EOF
)

    if DECISION=$(
        printf '%s' "$DECISION_PROMPT" |
        "$BASE_DIR/ask-gemini.sh"
    ); then
        DECISION_STATUS=0
    else
        DECISION_STATUS=$?
    fi

    echo
    echo "[AI TỔNG] Quyết định:"
    echo "$DECISION"
    echo

    echo "[$(date)] DECISION ROUND_$ROUND $CURRENT_AGENT" >> "$LOG"

    # ==================================================
    # ĐỌC JSON QUYẾT ĐỊNH
    # ==================================================

    NEXT_AGENT=$(printf '%s' "$DECISION" | python -c '
import sys,json
try:
    d=json.load(sys.stdin)
    print(str(d.get("next_agent","")).strip().lower())
except:
    print("")
')

    ACTION=$(printf '%s' "$DECISION" | python -c '
import sys,json
try:
    d=json.load(sys.stdin)
    print(str(d.get("action","")).strip().upper())
except:
    print("")
')

    FLOW_STATUS=$(printf '%s' "$DECISION" | python -c '
import sys,json
try:
    d=json.load(sys.stdin)
    print(str(d.get("status","")).strip().upper())
except:
    print("")
')

    REASON=$(printf '%s' "$DECISION" | python -c '
import sys,json
try:
    d=json.load(sys.stdin)
    print(str(d.get("reason","")).strip())
except:
    print("Không đọc được quyết định.")
')

    echo "[AI TỔNG] Next agent : ${NEXT_AGENT:-UNKNOWN}"
    echo "[AI TỔNG] Action     : ${ACTION:-UNKNOWN}"
    echo "[AI TỔNG] Status     : ${FLOW_STATUS:-UNKNOWN}"
    echo "[AI TỔNG] Reason     : $REASON"

    # ==================================================
    # NẾU GEMINI TRẢ JSON LỖI
    # ==================================================

    if [ "$DECISION_STATUS" -ne 0 ] || [ -z "$NEXT_AGENT" ]; then

        echo
        echo "⚠️ [AI TỔNG] Quyết định không hợp lệ."
        echo "➡️ Chuyển sang DEBUGGER."

        echo "[$(date)] INVALID_DECISION ROUND_$ROUND" >> "$LOG"

        CURRENT_RESULT="AI TỔNG không đọc được quyết định hợp lệ.

Quyết định nhận được:
$DECISION"

        CURRENT_AGENT="debugger"
        continue
    fi

    # ==================================================
    # HOÀN THÀNH
    # ==================================================

    if [ "$ACTION" = "DONE" ] || [ "$FLOW_STATUS" = "DONE" ]; then

        echo
        echo "========================================"
        echo "       🏁 AI TỔNG - HOÀN THÀNH"
        echo "========================================"
        echo
        echo "Task: $TASK"
        echo "Rounds: $ROUND"
        echo
        echo "Lý do:"
        echo "$REASON"

        sed -i 's/^RUNNING$/DONE/' "$TASK_FILE" 2>/dev/null || true

        echo "[$(date)] DONE $TASK_ID ROUND_$ROUND" >> "$LOG"

        exit 0
    fi

    # ==================================================
    # FAIL
    # ==================================================

    if [ "$ACTION" = "FAIL" ]; then

        echo
        echo "========================================"
        echo "       ❌ AI TỔNG - THẤT BẠI"
        echo "========================================"
        echo
        echo "$REASON"

        sed -i 's/^RUNNING$/FAILED/' "$TASK_FILE" 2>/dev/null || true

        echo "[$(date)] FAILED_DECISION $TASK_ID ROUND_$ROUND" >> "$LOG"

        exit 1
    fi

    # ==================================================
    # KIỂM TRA AGENT HỢP LỆ
    # ==================================================

    case "$NEXT_AGENT" in
        planner|coder|tester|reviewer|debugger)
            ;;
        *)
            echo
            echo "❌ AI Tổng chọn agent không hợp lệ: $NEXT_AGENT"
            echo "➡️ Chuyển sang DEBUGGER."

            echo "[$(date)] INVALID_AGENT $NEXT_AGENT ROUND_$ROUND" >> "$LOG"

            CURRENT_AGENT="debugger"
            CURRENT_RESULT="AI Tổng vừa nhận một quyết định có agent không hợp lệ:

$DECISION"
            continue
            ;;
    esac

    # ==================================================
    # CHUYỂN SANG AGENT TIẾP THEO
    # ==================================================

    CURRENT_RESULT="$RESULT"
    CURRENT_AGENT="$NEXT_AGENT"

    echo
    echo "========================================"
    echo "      🔀 AI TỔNG CHUYỂN AGENT"
    echo "========================================"
    echo
    echo "$CURRENT_AGENT"
    echo

done

# ======================================================
# QUÁ MAX ROUND
# ======================================================

echo
echo "========================================"
echo "       ⚠️ AI TỔNG - QUÁ GIỚI HẠN"
echo "========================================"
echo
echo "Đã chạy $MAX_ROUNDS vòng nhưng chưa hoàn thành."
echo "AI Tổng dừng để tránh vòng lặp vô hạn."

sed -i 's/^RUNNING$/MAX_ROUNDS_REACHED/' "$TASK_FILE" 2>/dev/null || true

echo "[$(date)] MAX_ROUNDS $TASK_ID" >> "$LOG"

exit 1
