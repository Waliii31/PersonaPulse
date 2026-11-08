from typing import List, Optional, Literal
from pydantic import BaseModel, Field

class BoundingBox(BaseModel):
    x: float
    y: float
    width: float
    height: float

class InteractiveElement(BaseModel):
    tag: str
    text: str = ""
    ariaLabel: Optional[str] = None
    boundingBox: BoundingBox

class Viewport(BaseModel):
    width: int = 1280
    height: int = 800

class DomSnapshot(BaseModel):
    title: str
    viewport: Viewport = Field(default_factory=Viewport)
    screenshotBase64: str = ""
    interactiveElements: List[InteractiveElement] = Field(default_factory=list)

class CompactDomSummary(BaseModel):
    title: str
    headings: List[str] = Field(default_factory=list)
    buttons: List[str] = Field(default_factory=list)
    links: List[dict] = Field(default_factory=list)
    inputs: List[dict] = Field(default_factory=list)
    contrast_hints: List[str] = Field(default_factory=list)
    interactiveElements: List[InteractiveElement] = Field(default_factory=list)
    token_estimate: int = 0

class PersonaStep(BaseModel):
    x: float
    y: float
    elementTag: str
    thought: str
    status: Literal["pass", "warn", "fail"]

class PersonaTrace(BaseModel):
    personaName: str
    role: str
    color: str
    steps: List[PersonaStep]

class Remediation(BaseModel):
    issueTitle: str
    severity: Literal["critical", "high", "medium", "low"]
    brokenHtml: str
    fixedReactTailwindCode: str
    explanation: str

class Scores(BaseModel):
    usability: int = Field(ge=0, le=100)
    accessibility: int = Field(ge=0, le=100)
    conversionReadiness: int = Field(ge=0, le=100)
    overallGrade: str

class AnalyzeRequest(BaseModel):
    url: str

class AnalyzeResponse(BaseModel):
    url: str
    slug: str
    scores: Scores
    domSnapshot: DomSnapshot
    personaTraces: List[PersonaTrace]
    remediations: List[Remediation]
