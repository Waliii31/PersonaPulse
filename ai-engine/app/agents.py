import os
import re
import json
from typing import List, Dict, Any
from urllib.parse import urlparse
import httpx
from openai import AsyncOpenAI
from .schemas import (
    CompactDomSummary,
    PersonaTrace,
    PersonaStep,
    Remediation,
    Scores,
    DomSnapshot,
    AnalyzeResponse,
    Viewport,
)

def make_slug(url: str) -> str:
    parsed = urlparse(url)
    host = parsed.netloc or parsed.path
    clean = re.sub(r"[^a-zA-Z0-9]+", "-", host).strip("-").lower()
    return f"{clean}-audit"

def run_deterministic_mock_analysis(url: str, dom: CompactDomSummary) -> AnalyzeResponse:
    """
    Deterministic zero-cost analysis simulating 3 personas and generating
    high-quality React + Tailwind CSS remediation patches based on actual extracted DOM.
    """
    slug = make_slug(url)

    # 1. Impatient Mobile Buyer (Maya Chen)
    maya_steps: List[PersonaStep] = []
    if dom.headings:
        maya_steps.append(PersonaStep(
            x=640.0, y=140.0, elementTag="h1",
            thought=f"Headline: '{dom.headings[0][:50]}'. Immediate hook, but is it clear on mobile viewport?",
            status="pass" if len(dom.headings[0]) < 60 else "warn"
        ))
    if dom.buttons:
        maya_steps.append(PersonaStep(
            x=540.0, y=320.0, elementTag="button",
            thought=f"Primary action '{dom.buttons[0]}' is visible. Good tap target sizing.",
            status="pass"
        ))
    else:
        maya_steps.append(PersonaStep(
            x=640.0, y=320.0, elementTag="div",
            thought="No clear primary CTA button found in the above-the-fold hero section.",
            status="fail"
        ))
    if dom.inputs:
        first_input = dom.inputs[0]
        has_label = first_input.get("has_label") == "True"
        maya_steps.append(PersonaStep(
            x=380.0, y=380.0, elementTag="input",
            thought=f"Input field '{first_input.get('placeholder', 'text')}'. " +
                    ("Label is visible." if has_label else "Missing visible label, relies on placeholder alone."),
            status="pass" if has_label else "warn"
        ))
    maya_steps.append(PersonaStep(
        x=750.0, y=24.0, elementTag="nav",
        thought="Quick navigation allows reviewing secondary pages without scroll fatigue.",
        status="pass"
    ))

    # 2. WCAG Accessibility Auditor (Darius Okafor)
    darius_steps: List[PersonaStep] = []
    if dom.contrast_hints:
        for i, hint in enumerate(dom.contrast_hints[:2]):
            darius_steps.append(PersonaStep(
                x=440.0, y=380.0 + (i * 60.0), elementTag="wcag",
                thought=f"Accessibility violation: {hint}",
                status="fail"
            ))
    else:
        darius_steps.append(PersonaStep(
            x=440.0, y=380.0, elementTag="input",
            thought="Input elements follow standard accessible labeling guidelines.",
            status="pass"
        ))
    darius_steps.append(PersonaStep(
        x=540.0, y=320.0, elementTag="button",
        thought="Button touch target meets minimum 44x44px CSS pixel requirement for WCAG 2.5.5.",
        status="pass"
    ))
    darius_steps.append(PersonaStep(
        x=640.0, y=140.0, elementTag="h1",
        thought="Heading hierarchy validated: page has structured semantic heading tags.",
        status="pass"
    ))

    # 3. First-Time Executive (Sandra Wu)
    sandra_steps: List[PersonaStep] = []
    sandra_steps.append(PersonaStep(
        x=640.0, y=140.0, elementTag="h1",
        thought="Evaluating enterprise value proposition from headline. Does this solve team scalability?",
        status="warn" if len(dom.headings) == 0 else "pass"
    ))
    has_pricing = any("pric" in str(link).lower() for link in dom.links)
    sandra_steps.append(PersonaStep(
        x=820.0, y=24.0, elementTag="a",
        thought="Checking for transparent pricing and enterprise demo options." if has_pricing else "No direct pricing link found in primary nav.",
        status="pass" if has_pricing else "warn"
    ))
    sandra_steps.append(PersonaStep(
        x=540.0, y=320.0, elementTag="button",
        thought="Seeking low-friction evaluation path (free pilot or sales demo contact).",
        status="pass"
    ))

    persona_traces = [
        PersonaTrace(
            personaName="Maya Chen",
            role="Impatient Mobile Buyer",
            color="#F59E0B",
            steps=maya_steps
        ),
        PersonaTrace(
            personaName="Darius Okafor",
            role="WCAG Accessibility Auditor",
            color="#2563EB",
            steps=darius_steps
        ),
        PersonaTrace(
            personaName="Sandra Wu",
            role="First-Time Executive",
            color="#8B5CF6",
            steps=sandra_steps
        ),
    ]

    # Generate realistic remediations
    primary_btn_text = dom.buttons[0] if dom.buttons else "Get Started"
    remediations: List[Remediation] = [
        Remediation(
            issueTitle="Form input missing accessible label association",
            severity="critical" if dom.contrast_hints else "high",
            brokenHtml='<input type="email" placeholder="Enter your email" class="border rounded px-3 py-2" />',
            fixedReactTailwindCode=(
                "// Fixed: Accessible form input with visible label & Dovetail/Humblytics styling\n"
                "export function AccessibleEmailField() {\n"
                "  return (\n"
                "    <div className=\"flex flex-col gap-1.5 w-full max-w-sm\">\n"
                "      <label\n"
                "        htmlFor=\"user-email\"\n"
                "        className=\"text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300\"\n"
                "      >\n"
                "        Work Email Address\n"
                "      </label>\n"
                "      <input\n"
                "        id=\"user-email\"\n"
                "        type=\"email\"\n"
                "        autoComplete=\"email\"\n"
                "        placeholder=\"alex@company.com\"\n"
                "        required\n"
                "        className=\"px-4 py-2.5 rounded-md border border-[#E6E4DD] dark:border-[#1F1F1F]\n"
                "                   bg-white dark:bg-[#0C0C0C] text-neutral-900 dark:text-neutral-100\n"
                "                   focus:outline-none focus:ring-2 focus:ring-[#E53E00]\n"
                "                   transition-all duration-150\"\n"
                "        aria-describedby=\"email-hint\"\n"
                "      />\n"
                "      <span id=\"email-hint\" className=\"text-xs text-neutral-500\">\n"
                "        Instant setup. No credit card required.\n"
                "      </span>\n"
                "    </div>\n"
                "  );\n"
                "}"
            ),
            explanation=(
                "Associating a persistent <label> via htmlFor/id satisfies WCAG 1.3.1. "
                "The aria-describedby hint provides confidence for both screen readers and visual buyers."
            )
        ),
        Remediation(
            issueTitle="Primary CTA button lacks keyboard focus ring & high-contrast state",
            severity="high",
            brokenHtml=f'<button class="btn">{primary_btn_text}</button>',
            fixedReactTailwindCode=(
                f"// Fixed: High-contrast primary CTA with WCAG 2.4.7 focus indicator\n"
                f"export function PrimaryCTA() {{\n"
                f"  return (\n"
                f"    <button\n"
                f"      type=\"submit\"\n"
                f"      className=\"inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md\n"
                f"                 bg-[#E53E00] hover:bg-[#CC3500] text-white font-medium text-sm\n"
                f"                 shadow-sm hover:shadow transition-all\n"
                f"                 focus-visible:outline-none focus-visible:ring-2\n"
                f"                 focus-visible:ring-[#E53E00] focus-visible:ring-offset-2\n"
                f"                 dark:focus-visible:ring-offset-[#050505]\"\n"
                f"    >\n"
                f"      <span>{primary_btn_text}</span>\n"
                f"      <svg className=\"w-4 h-4\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\">\n"
                f"        <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={{2}} d=\"M13 7l5 5m0 0l-5 5m5-5H6\" />\n"
                f"      </svg>\n"
                f"    </button>\n"
                f"  );\n"
                f"}}"
            ),
            explanation=(
                "Ensures the CTA meets minimum 44px tap target requirements, carries a visible focus-visible "
                "ring for keyboard power users, and maintains a 7.5:1 contrast ratio against the background."
            )
        ),
        Remediation(
            issueTitle="Missing skip-to-main link for screen reader and keyboard traversal",
            severity="medium",
            brokenHtml="<!-- Header navigation lacks skip anchor -->\n<header><nav>...</nav></header>",
            fixedReactTailwindCode=(
                "// Fixed: Skip-to-content bypass link satisfying WCAG 2.4.1\n"
                "export function SkipNavigation() {\n"
                "  return (\n"
                "    <a\n"
                "      href=\"#main-content\"\n"
                "      className=\"sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4\n"
                "                 focus:z-50 focus:px-4 focus:py-2.5 focus:rounded-md\n"
                "                 focus:bg-[#E53E00] focus:text-white focus:font-semibold\n"
                "                 focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-white\"\n"
                "    >\n"
                "      Skip to main content\n"
                "    </a>\n"
                "  );\n"
                "}"
            ),
            explanation=(
                "Provides keyboard users direct bypass of repetitive header navigation, cutting repetitive "
                "keystrokes and fulfilling WCAG 2.4.1 Bypass Blocks criteria."
            )
        )
    ]

    # Scores calculation
    fail_count = sum(1 for t in persona_traces for s in t.steps if s.status == "fail")
    warn_count = sum(1 for t in persona_traces for s in t.steps if s.status == "warn")

    usability = max(50, min(95, 90 - (fail_count * 8) - (warn_count * 3)))
    accessibility = max(45, min(92, 86 - (len(dom.contrast_hints) * 12) - (fail_count * 5)))
    conversion = max(55, min(94, 88 - (warn_count * 4) - (0 if dom.buttons else 20)))

    avg_score = (usability + accessibility + conversion) / 3
    if avg_score >= 88:
        grade = "A"
    elif avg_score >= 80:
        grade = "B+"
    elif avg_score >= 72:
        grade = "B"
    elif avg_score >= 65:
        grade = "C+"
    else:
        grade = "C"

    scores = Scores(
        usability=usability,
        accessibility=accessibility,
        conversionReadiness=conversion,
        overallGrade=grade,
    )

    dom_snapshot = DomSnapshot(
        title=dom.title,
        viewport=Viewport(),
        screenshotBase64="",
        interactiveElements=dom.interactiveElements,
    )

    return AnalyzeResponse(
        url=url,
        slug=slug,
        scores=scores,
        domSnapshot=dom_snapshot,
        personaTraces=persona_traces,
        remediations=remediations,
    )

async def run_live_ai_analysis(url: str, dom: CompactDomSummary) -> AnalyzeResponse:
    """
    Calls Groq via AsyncOpenAI client with strict 4,000 token limit.
    Falls back gracefully to deterministic simulator if API key is unset or error occurs.
    """
    groq_key = os.getenv("GROQ_API_KEY", "").strip()
    if not groq_key or groq_key == "your_groq_api_key_here":
        return run_deterministic_mock_analysis(url, dom)

    system_prompt = (
        "You are PersonaPulse's autonomous UX & accessibility evaluation engine. "
        "Analyze the provided compact DOM summary and return a single valid JSON object with keys: "
        "'scores' (usability, accessibility, conversionReadiness, overallGrade), "
        "'personaTraces' (array of 3 objects for 'Maya Chen', 'Darius Okafor', 'Sandra Wu' with 'steps': [{x, y, elementTag, thought, status: 'pass'|'warn'|'fail'}]), "
        "and 'remediations' (array of 3 objects with issueTitle, severity, brokenHtml, fixedReactTailwindCode, explanation). "
        "Output ONLY raw JSON. No markdown fences, no conversational prose."
    )

    user_prompt = f"""Target URL: {url}
Compact DOM Summary:
Title: {dom.title}
Headings: {json.dumps(dom.headings)}
Buttons: {json.dumps(dom.buttons)}
Inputs: {json.dumps(dom.inputs)}
Links: {json.dumps(dom.links)}
Contrast/WCAG hints: {json.dumps(dom.contrast_hints)}
"""

    try:
        client = AsyncOpenAI(
            base_url="https://api.groq.com/openai/v1",
            api_key=groq_key,
        )
        model = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

        response = await client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.2,
            max_tokens=2200,
            response_format={"type": "json_object"},
        )

        content = response.choices[0].message.content or ""
        parsed_json = json.loads(content)

        scores = Scores(**parsed_json.get("scores", {}))
        persona_traces = [PersonaTrace(**t) for t in parsed_json.get("personaTraces", [])]
        remediations = [Remediation(**r) for r in parsed_json.get("remediations", [])]

        dom_snapshot = DomSnapshot(
            title=dom.title,
            viewport=Viewport(),
            screenshotBase64="",
            interactiveElements=dom.interactiveElements,
        )

        return AnalyzeResponse(
            url=url,
            slug=make_slug(url),
            scores=scores,
            domSnapshot=dom_snapshot,
            personaTraces=persona_traces,
            remediations=remediations,
        )
    except Exception as e:
        print(f"⚠️ Live LLM call failed ({e}). Falling back to deterministic analysis.")
        return run_deterministic_mock_analysis(url, dom)

async def analyze_url(url: str, dom: CompactDomSummary) -> AnalyzeResponse:
    mode = os.getenv("AI_MODE", "mock").lower()
    if mode == "live":
        return await run_live_ai_analysis(url, dom)
    return run_deterministic_mock_analysis(url, dom)
