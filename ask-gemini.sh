#!/data/data/com.termux/files/usr/bin/bash

PROMPT="$*"

if [ -z "$PROMPT" ]; then
  echo "Cách dùng: ./ask-gemini.sh \"câu hỏi\""
  exit 1
fi

RESPONSE=$(./gemini.sh "$PROMPT")

printf '%s' "$RESPONSE" | python -c '
import sys, json

try:
    data = json.load(sys.stdin)

    if "error" in data:
        print("GEMINI ERROR:")
        print(data["error"].get("message", "Lỗi không xác định"))
        sys.exit(1)

    text = data["candidates"][0]["content"]["parts"][0]["text"]
    print(text)

except Exception as e:
    print("Không đọc được phản hồi Gemini:")
    print(e)
    sys.exit(1)
'
