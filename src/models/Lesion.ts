import mongoose, { Document, Schema } from 'mongoose';

interface Lesion extends Document {
  fullName: string;
  age: number;
  gender: string;
  contactNumber: string;
  location: string;
  symptoms: string;
  duration: string;
  habits: string;
  previousDentalTreatments: string;
  submittedBy: mongoose.Schema.Types.ObjectId;
  assignedToAdmins?: mongoose.Schema.Types.ObjectId[];
  images: string[];
  adminConfirmed: boolean;

}

const lesionSchema = new Schema<Lesion>({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
  },
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required'],
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
  },
  symptoms: {
    type: String,
    required: [true, 'Symptoms are required'],
    trim: true,
  },
  duration: {
    type: String,
  },
  habits: {
    type: String,
  },
  previousDentalTreatments: {
    type: String,
    required: [true, 'Previous dental treatments are required'],
    trim: true,
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: [true, 'sender  is required'],
  },
  assignedToAdmins: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    
  }],
  images: {
    type: [String],
    required: [true, 'Image URLs are required'],
  },
  adminConfirmed: {
    type: Boolean,
    default: false,
  },
});

const LesionModel = mongoose.models.lesions || mongoose.model<Lesion>('lesions', lesionSchema);

export default LesionModel;
