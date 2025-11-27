import { Document, Schema, model } from 'mongoose';

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'viewer';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'viewer'], default: 'viewer' },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        const plain = ret as Record<string, any>;
        plain.id = plain._id.toString();
        delete plain._id;
        delete plain.__v;
        delete plain.password;
        return plain;
      },
    },
  }
);

export const User = model<UserDocument>('User', UserSchema);

