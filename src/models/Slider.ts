import mongoose, { Schema, Document } from 'mongoose';

interface IBody {
  image: string;
  text: { en: string; kn: string };
  description: { en: string; kn: string };
}

export interface ISlider extends Document {
  sliderImage: string;
  text: { en: string; kn: string };
  description: { en: string; kn: string };
  body: IBody[];
  createdAt: Date;
  updatedAt: Date;
}

const SliderSchema = new Schema<ISlider>({
  sliderImage: { type: String, required: true },
  text: {
    en: { type: String, required: true },
    kn: { type: String, required: true },
  },
  description: {
    en: { type: String, required: true },
    kn: { type: String, required: true },
  },
  body: [
    {
      image: { type: String, required: true },
      text: {
        en: { type: String, required: true },
        kn: { type: String, required: true },
      },
      description: {
        en: { type: String, required: true },
        kn: { type: String, required: true },
      }
    }
  ]
}, { timestamps: true });

export default mongoose.models.slides || mongoose.model<ISlider>('slides', SliderSchema);
