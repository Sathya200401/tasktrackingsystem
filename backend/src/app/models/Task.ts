import { Document, Schema, model, Types } from 'mongoose';

export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'testing' | 'need_review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export interface TaskDocument extends Document {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  tags: string[];
  milestone?: string;
  estimatedHours?: number;
  linkedDocs: string[];
  assignedTo: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<TaskDocument>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    status: { type: String, enum: ['todo', 'in_progress', 'in_review', 'testing', 'need_review', 'done'], default: 'todo' },
    priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
    dueDate: { type: Date },
    tags: { type: [String], default: [] },
    milestone: { type: String, trim: true },
    estimatedHours: { type: Number, min: 0 },
    linkedDocs: { type: [String], default: [] },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
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

export const Task = model<TaskDocument>('Task', TaskSchema);

