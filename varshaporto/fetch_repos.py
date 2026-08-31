import json
import urllib.request
import re
import base64
import time

with open(
    r"C:\Users\Varsha Kaushik\.cursor\projects\c-Users-Varsha-Kaushik-OneDrive-Desktop-varshaporto\agent-tools\85a19efd-8955-4fd6-b22e-e5adaf401fa8.txt",
    encoding="utf-8",
) as f:
    repos = json.load(f)

skip = {"Varsha-vk-05"}
live_pattern = re.compile(
    r"https?://(?:[\w-]+\.)?(?:vercel\.app|netlify\.app|github\.io|pages\.dev|render\.com|railway\.app|herokuapp\.com|firebaseapp\.com|web\.app)[^\s)\]\"'<>]*",
    re.I,
)

known_live = {
    "organopredictor": "https://farmercroppredictions.netlify.app/",
    "AiContentCreation": "https://6940404f7a649900c7c68a54--aicontentcreation.netlify.app/",
    "Dreamcare": "https://dermadetect.netlify.app/",
    "daylytics": "https://daylytics-ten.vercel.app",
    "My_Portfolio": "https://my-portfolio-delta-six-50.vercel.app",
}

results = []
for r in sorted(repos, key=lambda x: x.get("updated_at", ""), reverse=True):
    name = r["name"]
    if name in skip:
        continue
    live = r.get("homepage") or known_live.get(name, "")
    readme_live = []
    try:
        url = f"https://api.github.com/repos/Varsha-vk-05/{name}/readme"
        req = urllib.request.Request(url, headers={"User-Agent": "portfolio-builder"})
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.load(resp)
        content = base64.b64decode(data["content"]).decode("utf-8", errors="ignore")
        for match in live_pattern.findall(content):
            if "github.com/Varsha-vk-05" not in match and "img.shields.io" not in match:
                readme_live.append(match.rstrip(".,)"))
    except Exception:
        pass
    if not live and readme_live:
        live = readme_live[0]
    results.append(
        {
            "name": name,
            "description": r.get("description") or "",
            "url": r["html_url"],
            "live": live,
            "language": r.get("language") or "",
            "created": (r.get("created_at") or "")[:10],
            "updated": (r.get("updated_at") or "")[:10],
            "topics": r.get("topics") or [],
        }
    )
    time.sleep(0.12)

print(json.dumps(results, indent=2))
