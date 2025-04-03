import mongoose, { Schema, Document } from 'mongoose';

 
const bilingualField = {
  en: { type: String, required: true },
  kn: { type: String, required: true },
};

export interface IDisease extends Document {
  category: mongoose.Types.ObjectId;  
  disease_title: { en: string; kn: string };
  disease_paragraph: { en: string; kn: string };
  disease_icon: string;
  disease_heading_first: { en: string; kn: string };
  disease_description_first: { en: string; kn: string };
  disease_icon_first: string;
  disease_repeat_title_first: { en: string; kn: string };
  disease_repeat_para_first: { en: string; kn: string };
  disease_repeat_icon_first: string;
  disease_heading_second: { en: string; kn: string };
  disease_description_second: { en: string; kn: string };
  disease_icon_second: string;
  disease_repeat_title_second: { en: string; kn: string };
  disease_repeat_para_second: { en: string; kn: string };
  disease_repeat_icon_second: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const DiseaseSchema: Schema = new Schema(
  {
    category: {
      type: Schema.Types.ObjectId,
      ref: 'categories',  
      required: true,
    },
    disease_title: bilingualField,
    disease_paragraph: bilingualField,
    disease_icon: { type: String, required: true },
    disease_heading_first: bilingualField,
    disease_description_first: bilingualField,
    disease_icon_first: { type: String, required: true },
    disease_repeat_title_first: bilingualField,
    disease_repeat_para_first: bilingualField,
    disease_repeat_icon_first: { type: String, required: true },
    disease_heading_second: bilingualField,
    disease_description_second: bilingualField,
    disease_icon_second: { type: String, required: true },
    disease_repeat_title_second: bilingualField,
    disease_repeat_para_second: bilingualField,
    disease_repeat_icon_second: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const DiseaseModel = mongoose.models.habitoraldiseases || mongoose.model<IDisease>('habitoraldiseases', DiseaseSchema);
export default DiseaseModel;
