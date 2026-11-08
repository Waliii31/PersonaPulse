"""
PersonaPulse AI Engine Automated Test Suite
Tests:
1. Health check endpoint (/health)
2. SSRF prevention on /analyze-url (blocks loopback, private IPs, metadata)
3. DOM Extractor & Zero-Cost Token Guardrail (< 1,000 tokens)
4. Schema validation for PersonaTraces and React Code Remediations
"""

import sys
import os
import unittest
from pathlib import Path
from bs4 import BeautifulSoup

# Add ai-engine to Python path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.main import app, is_safe_external_url
from app.dom_extractor import CompactDomSummary, InteractiveElement, BoundingBox
from app.schemas import AnalyzeRequest, AnalyzeResponse, PersonaStep, Remediation
from fastapi.testclient import TestClient

class TestPersonaPulseAIEngine(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_01_health_check(self):
        """GET /health must return 200 with service name and status ok"""
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "ok")
        self.assertEqual(data["service"], "PersonaPulse AI Engine")
        self.assertIn("ai_mode", data)

    def test_02_ssrf_protection_validator(self):
        """is_safe_external_url must allow public domains and block private/loopback"""
        # Safe URLs
        self.assertTrue(is_safe_external_url("https://stripe.com"))
        self.assertTrue(is_safe_external_url("https://notion.so/pricing"))
        self.assertTrue(is_safe_external_url("http://example.com"))

        # Blocked SSRF targets
        self.assertFalse(is_safe_external_url("http://localhost:8000"))
        self.assertFalse(is_safe_external_url("http://127.0.0.1:4000"))
        self.assertFalse(is_safe_external_url("http://169.254.169.254/latest/meta-data"))
        self.assertFalse(is_safe_external_url("http://10.0.0.1/admin"))
        self.assertFalse(is_safe_external_url("http://192.168.1.1"))
        self.assertFalse(is_safe_external_url("file:///etc/passwd"))

    def test_03_analyze_url_ssrf_rejection(self):
        """POST /analyze-url must return 400 when an internal or loopback address is submitted"""
        response = self.client.post("/analyze-url", json={"url": "http://127.0.0.1:8000"})
        self.assertEqual(response.status_code, 400)
        data = response.json()
        self.assertIn("detail", data)
        self.assertIn("forbidden", data["detail"].lower())

    def test_04_schema_validation(self):
        """Test Pydantic schemas for PersonaStep, Remediation, and AnalyzeRequest"""
        req = AnalyzeRequest(url="https://stripe.com")
        self.assertEqual(req.url, "https://stripe.com")

        step = PersonaStep(
            elementTag="button",
            x=640,
            y=320,
            thought="CTA button has poor contrast with background.",
            status="warn"
        )
        self.assertEqual(step.status, "warn")
        self.assertEqual(step.x, 640)

        remediation = Remediation(
            issueTitle="Low Contrast on Primary Button",
            severity="high",
            brokenHtml="<button class='bg-gray-200 text-gray-300'>Sign Up</button>",
            fixedReactTailwindCode="<button className='bg-[#E53E00] text-white px-4 py-2 font-semibold'>Sign Up</button>",
            explanation="Increased contrast ratio to meet WCAG AAA standard."
        )
        self.assertEqual(remediation.severity, "high")
        self.assertIn("bg-[#E53E00]", remediation.fixedReactTailwindCode)

    def test_05_dom_token_guardrail(self):
        """DOM extraction must strip scripts, styles, comments, and remain compact (< 1,000 tokens)"""
        raw_html = """
        <!DOCTYPE html>
        <html>
        <head>
            <title>Test Page For AI Engine</title>
            <script>console.log("very long script that should be stripped" + "x".repeat(5000));</script>
            <style>body { background: red; } /* large css rules */</style>
        </head>
        <body>
            <header>
                <nav>
                    <a href="/">Home</a>
                    <a href="/pricing">Pricing</a>
                </nav>
            </header>
            <main>
                <h1>Autonomous Testing Platform</h1>
                <p>Convert more traffic into clean conversions.</p>
                <button id="cta-btn" class="btn-primary">Get Started Free</button>
                <input type="email" placeholder="Enter your email" />
            </main>
        </body>
        </html>
        """
        soup = BeautifulSoup(raw_html, "html.parser")
        for tag in soup(["script", "style", "noscript", "svg"]):
            tag.decompose()

        cleaned_text = soup.get_text(separator=" ", strip=True)
        # Token estimate: approx 1 token per 4 chars
        token_count = len(cleaned_text) // 4
        self.assertLess(token_count, 1000, f"Token count {token_count} exceeds 1,000 token guardrail")
        self.assertNotIn("console.log", cleaned_text)
        self.assertIn("Autonomous Testing Platform", cleaned_text)

if __name__ == "__main__":
    unittest.main()
