import { Schema, model, Document } from 'mongoose';

export type EmployeeRole = 'admin' | 'member';

export interface EmployeeDocument extends Document {
  name: string;
  title?: string;
  department?: string;
  email: string;
  avatarUrl?: string;
  location?: string;
  phone?: string;
  skills: string[];
  allocation?: number;
  startDate?: Date;
  role: EmployeeRole;
  createdAt: Date;
  updatedAt: Date;
}

const EmployeeSchema = new Schema<EmployeeDocument>(
  {
    name: { type: String, required: true, trim: true },
    title: { type: String, trim: true },
    department: { type: String, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    avatarUrl: { type: String },
    location: { type: String },
    phone: { type: String, trim: true },
    skills: { type: [String], default: [] },
    allocation: { type: Number, min: 0, max: 100 },
    startDate: { type: Date },
    role: { type: String, enum: ['admin', 'member'], default: 'member' },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        const plain = ret as Record<string, any>;
        plain.id = plain._id.toString();
        delete plain._id;
        delete plain.__v;
        return plain;
      },
    },
  }
);

export const Employee = model<EmployeeDocument>('Employee', EmployeeSchema);

