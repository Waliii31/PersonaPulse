import mongoose, { Document, Schema } from 'mongoose';

// ── Sub-schemas ──────────────────────────────────────────────────────────────

export interface IPersonaStep {
  x: number;
  y: number;
  elementTag: string;
  thought: string;
  status: 'pass' | 'warn' | 'fail';
}

export interface IPersonaTrace {
  personaName: string;
  role: string;
  color: string;
  steps: IPersonaStep[];
}

export interface IRemediation {
  issueTitle: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  brokenHtml: string;
  fixedReactTailwindCode: string;
  explanation: string;
}

export interface IScores {
  usability: number;
  accessibility: number;
  conversionReadiness: number;
  overallGrade: string;
}

export interface IDomSnapshot {
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

// ── Main Interface ───────────────────────────────────────────────────────────

export interface IAuditReport extends Document {
  url: string;
  slug: string;
  cachedAt: Date;
  isSandbox: boolean;
  scores: IScores;
  domSnapshot: IDomSnapshot;
  personaTraces: IPersonaTrace[];
  remediations: IRemediation[];
}

// ── Mongoose Schema ──────────────────────────────────────────────────────────

const PersonaStepSchema = new Schema<IPersonaStep>(
  {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    elementTag: { type: String, required: true },
    thought: { type: String, required: true },
    status: { type: String, enum: ['pass', 'warn', 'fail'], required: true },
  },
  { _id: false }
);

const PersonaTraceSchema = new Schema<IPersonaTrace>(
  {
    personaName: { type: String, required: true },
    role: { type: String, required: true },
    color: { type: String, required: true },
    steps: [PersonaStepSchema],
  },
  { _id: false }
);

const RemediationSchema = new Schema<IRemediation>(
  {
    issueTitle: { type: String, required: true },
    severity: {
      type: String,
      enum: ['critical', 'high', 'medium', 'low'],
      required: true,
    },
    brokenHtml: { type: String, required: true },
    fixedReactTailwindCode: { type: String, required: true },
    explanation: { type: String, required: true },
  },
  { _id: false }
);

const ScoresSchema = new Schema<IScores>(
  {
    usability: { type: Number, required: true, min: 0, max: 100 },
    accessibility: { type: Number, required: true, min: 0, max: 100 },
    conversionReadiness: { type: Number, required: true, min: 0, max: 100 },
    overallGrade: { type: String, required: true },
  },
  { _id: false }
);

const DomSnapshotSchema = new Schema<IDomSnapshot>(
  {
    title: { type: String, required: true },
    viewport: {
      width: { type: Number, default: 1280 },
      height: { type: Number, default: 800 },
    },
    screenshotBase64: { type: String, default: '' },
    interactiveElements: [
      {
        tag: String,
        text: String,
        ariaLabel: String,
        boundingBox: {
          x: Number,
          y: Number,
          width: Number,
          height: Number,
        },
        _id: false,
      },
    ],
  },
  { _id: false }
);

const AuditReportSchema = new Schema<IAuditReport>(
  {
    url: { type: String, required: true, index: true },
    slug: { type: String, required: true, unique: true },
    cachedAt: { type: Date, default: Date.now },
    isSandbox: { type: Boolean, default: false },
    scores: { type: ScoresSchema, required: true },
    domSnapshot: { type: DomSnapshotSchema, required: true },
    personaTraces: [PersonaTraceSchema],
    remediations: [RemediationSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const AuditReport = mongoose.model<IAuditReport>(
  'AuditReport',
  AuditReportSchema
);
