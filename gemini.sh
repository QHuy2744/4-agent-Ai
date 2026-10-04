#!/data/data/com.termux/files/usr/bin/bash

if [ -z "$GEMINI_API_KEY" ]; then
  echo "Chưa có GEMINI_API_KEY."
  exit 1
fi

PROMPT="$*"

if [ -z "$PROMPT" ]; then
  echo "Cách dùng: ./gemini.sh \"câu hỏi của bạn\""
  exit 1
fi

curl -s \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${GEMINI_API_KEY}" \
  -H "Content-Type: application/json" \
  -d "$(python -c 'import json,sys; print(json.dumps({"contents":[{"parts":[{"text":sys.argv[1]}]}]}))' "$PROMPT")"
