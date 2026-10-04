import json
import subprocess
from pathlib import Path

data = Path(".bangiao/thay-doi.json").read_text()
data = data.replace("```json", "").replace("```", "").strip()

obj = json.loads(data)
files = obj["files"]

subprocess.run([
    "git", "worktree", "add",
    "--detach",
    ".bangiao/worktree",
    "HEAD"
], check=True)

try:
    root = Path(".bangiao/worktree").resolve()

    for item in files:
        path = item["path"]
        content = item["content"]

        if path.startswith(".git/") or path.startswith(".bangiao/"):
            continue

        target = (root / path).resolve()

        if not str(target).startswith(str(root) + "/"):
            raise Exception("Path khong an toan: " + path)

        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(content)

        subprocess.run(
            ["git", "-C", ".bangiao/worktree", "add", "--intent-to-add", "--", path],
            check=True
        )

    result = subprocess.run(
        ["git", "-C", ".bangiao/worktree", "diff", "--binary"],
        capture_output=True,
        text=True,
        check=True
    )

    Path(".bangiao/thay-doi.patch").write_text(result.stdout)

finally:
    subprocess.run([
        "git", "worktree", "remove",
        "--force",
        ".bangiao/worktree"
    ])
