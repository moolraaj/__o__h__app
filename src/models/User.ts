// models/User.ts
import mongoose, { Schema, Document, Model, models } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: 'user' | 'admin' | 'ambassador' | 'super-admin';
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: [true, 'Name is required'] },
    email: { type: String, required: [true, 'Email is required'], unique: true },
    password: { type: String, required: [true, 'Password is required'] },
    phoneNumber: { type: String},
    role: {
      type: String,
      enum: ['user', 'admin', 'ambassador', 'super-admin'],
      default: 'user',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const User: Model<IUser> = models.users || mongoose.model<IUser>('users', userSchema);
export default User;
