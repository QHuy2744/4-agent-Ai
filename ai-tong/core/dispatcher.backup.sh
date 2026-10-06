#!/data/data/com.termux/files/usr/bin/bash

BASE_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
REGISTRY="$BASE_DIR/ai-tong/agents/registry.json"
LOG="$BASE_DIR/ai-tong/logs/dispatcher.log"

AGENT="$1"
TASK="$2"

if [ -z "$AGENT" ] || [ -z "$TASK" ]; then
    echo "Cách dùng:"
    echo './ai-tong/core/dispatcher.sh coder "Sửa lỗi trong app.js"'
    exit 1
fi

if ! python - "$REGISTRY" "$AGENT" <<'PY'
import json
import sys

registry = json.load(open(sys.argv[1]))
agent = sys.argv[2]

agents = [a["id"] for a in registry["agents"]]

if agent not in agents:
    print("AGENT_NOT_FOUND")
    sys.exit(1)

print("AGENT_OK")
PY
then
    echo "❌ Agent không tồn tại: $AGENT"
    exit 1
fi

mkdir -p "$(dirname "$LOG")"

echo "========================================"
echo "        AI TỔNG → DISPATCHER"
echo "========================================"
echo
echo "Agent : $AGENT"
echo "Task  : $TASK"
echo

echo "[$(date)] DISPATCH $AGENT -> $TASK" >> "$LOG"

case "$AGENT" in

    planner)
        PROMPT="Bạn là PLANNER.
Hãy phân tích nhiệm vụ sau và lập kế hoạch rõ ràng:

$TASK"
        ;;

    coder)
        PROMPT="Bạn là CODER.
Hãy thực hiện nhiệm vụ sau:

$TASK

Chỉ tập trung vào việc viết hoặc sửa code."
        ;;

    tester)
        PROMPT="Bạn là TESTER.
Hãy kiểm tra nhiệm vụ sau, tìm lỗi và báo cáo kết quả:

$TASK"
        ;;

    reviewer)
        PROMPT="Bạn là REVIEWER.
Hãy đánh giá nhiệm vụ sau và tìm vấn đề:

$TASK"
        ;;

    debugger)
        PROMPT="Bạn là DEBUGGER.

Bạn được AI TỔNG giao nhiệm vụ sửa lỗi cho một agent khác.

Nhiệm vụ:

$TASK

Hãy:
1. Xác định nguyên nhân lỗi.
2. Xác định agent hoặc thành phần bị lỗi.
3. Đề xuất cách sửa.
4. Nếu cần, tạo phương án sửa cụ thể."
        ;;

    *)
        echo "❌ Không biết cách gọi agent: $AGENT"
        exit 1
        ;;
esac

echo "[AI TỔNG] Đang giao việc..."
echo

printf '%s' "$PROMPT" | "$BASE_DIR/ask-gemini.sh"

STATUS=$?

echo
echo "----------------------------------------"

if [ "$STATUS" -eq 0 ]; then
    echo "[AI TỔNG] Agent hoàn thành nhiệm vụ."
    echo "[$(date)] SUCCESS $AGENT" >> "$LOG"
else
    echo "[AI TỔNG] Agent thất bại."
    echo "[$(date)] FAILED $AGENT" >> "$LOG"
fi

exit "$STATUS"

