import mongoose, { Schema, Document } from 'mongoose';

export interface ISavedAudit {
  slug: string;
  url: string;
  title: string;
  overallGrade: string;
  usability?: number;
  savedAt: Date;
}

export interface ICustomPersona {
  name: string;
  role: string;
  viewportSize: string;
  focusArea: string;
  color: string;
  createdAt: Date;
}

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  avatarColor: string;
  role: string;
  savedAudits: ISavedAudit[];
  customPersonas: ICustomPersona[];
  scansRemaining: number;
  createdAt: Date;
  updatedAt: Date;
}

const SavedAuditSchema = new Schema<ISavedAudit>(
  {
    slug: { type: String, required: true },
    url: { type: String, required: true },
    title: { type: String, required: true },
    overallGrade: { type: String, default: 'B' },
    usability: { type: Number, default: 85 },
    savedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const CustomPersonaSchema = new Schema<ICustomPersona>(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    viewportSize: { type: String, default: 'Desktop (1440x900)' },
    focusArea: { type: String, default: 'Conversion Optimization & UX Heuristics' },
    color: { type: String, default: '#E53E00' },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    avatarColor: { type: String, default: '#E53E00' },
    role: { type: String, default: 'pro' },
    savedAudits: [SavedAuditSchema],
    customPersonas: [CustomPersonaSchema],
    scansRemaining: { type: Number, default: 2 },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>('User', UserSchema);
