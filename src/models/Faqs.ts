import mongoose from 'mongoose';
const { Schema } = mongoose;

const Language = {
  en: { type: String, required: true },
  kn: { type: String, required: true },
};

const QAEntrySchema = new Schema({
  question: { ...Language },
  answer: { ...Language },
}, { _id: false });

const DentalContentSchema = new Schema({

  dental_caries_title: { ...Language },
  dental_caries: [QAEntrySchema],

  gum_diseases_title: { ...Language },
  gum_disease: [QAEntrySchema],

  edentulism_title: { ...Language },
  edentulism: [QAEntrySchema],

  oral_cancer_title: { ...Language },
  oral_cancer: [QAEntrySchema],

}, { timestamps: true });

const FaqModel = mongoose.models.faqs || mongoose.model('faqs', DentalContentSchema);

export default FaqModel;
