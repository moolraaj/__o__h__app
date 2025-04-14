import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILesionRecord extends Document {
  fullname: string;
  age: number;
  gender: string;
  contact_number: string;
  location: string;
  symptoms: string;
  disease_time: string;
  existing_habits: string;
  previous_dental_treatement: string;
  submitted_by: mongoose.Types.ObjectId;
  send_to: mongoose.Types.ObjectId[];
  dental_images: string[];
  status: string;
  adminAction: boolean;

  // admins fields only
  lesion_type?: string;
  diagnosis_notes?: string;
  recomanded_actions?: string;
  comments_or_notes?: string;
  send_email_to_dantasurakshaks?:boolean
}

const lesionRecordSchema: Schema = new Schema(
  {
    fullname: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    contact_number: { type: String, required: true },
    location: { type: String, required: true },
    symptoms: { type: String, required: true },
    disease_time: { type: String, required: true },
    existing_habits: { type: String, required: true },
    previous_dental_treatement: { type: String },
    submitted_by: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    send_to: { type: [mongoose.Schema.Types.ObjectId], ref: 'users', required: true },
    dental_images: { type: [String] },
    status: { type: String, default: 'unsubmit' },
    adminAction: { type: Boolean, default: false },
  


    // admin feedback fields only
    lesion_type: { type: String, select: false },
    diagnosis_notes: { type: String, select: false },
    recomanded_actions: { type: String, select: false },
    comments_or_notes: { type: String, select: false },
    send_email_to_dantasurakshaks:{ type: Boolean, select: false,default: false}
  },
  {
    timestamps: true,
  }
);

export const LesionModel: Model<ILesionRecord> =
  mongoose.models.LesionRecord || mongoose.model<ILesionRecord>('LesionRecord', lesionRecordSchema);
