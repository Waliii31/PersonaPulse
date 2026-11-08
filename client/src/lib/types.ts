export interface PersonaStep {
  x: number;
  y: number;
  elementTag: string;
  thought: string;
  status: 'pass' | 'warn' | 'fail';
}

export interface PersonaTrace {
  personaName: string;
  role: string;
  color: string;
  steps: PersonaStep[];
}

export interface Remediation {
  issueTitle: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  brokenHtml: string;
  fixedReactTailwindCode: string;
  explanation: string;
}

export interface Scores {
  usability: number;
  accessibility: number;
  conversionReadiness: number;
  overallGrade: string;
}

export interface DomSnapshot {
  title: string;
  viewport: { width: number; height: number };
  screenshotBase64: string;
  interactiveElements: Array<{
    tag: string;
    text: string;
    ariaLabel?: string;
    boundingBox: { x: number; y: number; width: number; height: number };
  }>;
}

export interface AuditReport {
  _id?: string;
  url: string;
  slug: string;
  cachedAt: string;
  isSandbox?: boolean;
  scores: Scores;
  domSnapshot: DomSnapshot;
  personaTraces: PersonaTrace[];
  remediations: Remediation[];
}

export interface ISavedAudit {
  slug: string;
  url: string;
  title: string;
  overallGrade: string;
  usability?: number;
  savedAt: string;
}

export interface ICustomPersona {
  _id?: string;
  name: string;
  role: string;
  viewportSize: string;
  focusArea: string;
  color: string;
  createdAt?: string;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  avatarColor: string;
  role: string;
  scansRemaining: number;
  savedAudits: ISavedAudit[];
  customPersonas: ICustomPersona[];
}

