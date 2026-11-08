import os
from urllib.parse import urlparse
import ipaddress
from datetime import datetime, timezone
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

from .schemas import AnalyzeRequest, AnalyzeResponse
from .dom_extractor import fetch_and_extract_dom, capture_screenshot_base64
from .agents import analyze_url

app = FastAPI(
    title="PersonaPulse AI Engine",
    description="Autonomous Multi-Agent User Testing & UI Remediation Engine",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    ai_mode = os.getenv("AI_MODE", "mock")
    return {
        "status": "ok",
        "service": "PersonaPulse AI Engine",
        "version": "1.0.0",
        "ai_mode": ai_mode,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }

BLOCKED_HOSTNAMES = {
    "localhost",
    "127.0.0.1",
    "0.0.0.0",
    "::1",
    "169.254.169.254",
    "metadata.google.internal",
    "instance-data",
}

def is_safe_external_url(url: str) -> bool:
    try:
        parsed = urlparse(url)
        if parsed.scheme not in ("http", "https"):
            return False
        hostname = (parsed.hostname or "").lower()
        if not hostname or hostname in BLOCKED_HOSTNAMES:
            return False
        if any(hostname.endswith(sfx) for sfx in (".localhost", ".local", ".internal", ".test", ".corp")):
            return False
        try:
            ip = ipaddress.ip_address(hostname)
            if ip.is_private or ip.is_loopback or ip.is_link_local:
                return False
        except ValueError:
            pass
        return True
    except Exception:
        return False

@app.post("/analyze-url", response_model=AnalyzeResponse)
async def analyze_url_endpoint(request: AnalyzeRequest):
    url = request.url.strip()
    if not url.startswith("http://") and not url.startswith("https://"):
        url = f"https://{url}"

    if not is_safe_external_url(url):
        raise HTTPException(
            status_code=400,
            detail="Scanning private, loopback, or internal cloud metadata addresses is forbidden for security."
        )

    try:
        # Step 1: Lightweight DOM extractor (< 1,000 tokens)
        compact_dom = await fetch_and_extract_dom(url)

        # Step 2: Multi-agent persona evaluation & remediation generator (< 4,000 tokens)
        # Note: Raw full-page screenshot is NEVER sent to LLMs (Zero-Cost Token Guardrail!)
        result = await analyze_url(url, compact_dom)

        # Step 3: Capture real Playwright screenshot and attach to domSnapshot for UI display
        screenshot_base64 = await capture_screenshot_base64(url)
        if screenshot_base64:
            result.domSnapshot.screenshotBase64 = screenshot_base64

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run("app.main:app", host=host, port=port, reload=True)
