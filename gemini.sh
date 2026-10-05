#!/data/data/com.termux/files/usr/bin/bash

if [ -z "$GEMINI_API_KEY" ]; then
  echo '{"error":{"message":"Chưa có GEMINI_API_KEY."}}'
  exit 1
fi

if [ -t 0 ]; then
  PROMPT="$*"
else
  PROMPT="$(cat)"
fi

if [ -z "$PROMPT" ]; then
  echo '{"error":{"message":"Chưa có prompt."}}'
  exit 1
fi

printf '%s' "$PROMPT" |
python -c '
import json
import sys

prompt = sys.stdin.read()

payload = {
    "contents": [
        {
            "parts": [
                {
                    "text": prompt
                }
            ]
        }
    ]
}

print(json.dumps(payload, ensure_ascii=False))
' |
curl -s \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${GEMINI_API_KEY}" \
  -H "Content-Type: application/json" \
  -d @-
