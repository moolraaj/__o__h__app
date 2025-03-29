import mongoose, { Schema, Document } from 'mongoose';

interface ILocalizedText {
  en: string;
  kn: string;
}

export interface IMythFact extends Document {
  myth_fact_image: string;
  myth_fact_title: ILocalizedText;
  myth_fact_body: ILocalizedText;
  myth_fact_heading: ILocalizedText;
  myth_fact_description: ILocalizedText;
  myths_facts_wrong_fact: ILocalizedText[];
  myths_facts_right_fact: ILocalizedText[];
  createdAt?: Date;
  updatedAt?: Date;
}

const LocalizedSchema = {
  en: { type: String, required: true },
  kn: { type: String, required: true },
};

const MythFactSchema: Schema = new Schema(
  {
    myth_fact_image: { type: String, required: true },
    myth_fact_title: LocalizedSchema,
    myth_fact_body: LocalizedSchema,
    myth_fact_heading: LocalizedSchema,
    myth_fact_description: LocalizedSchema,
    myths_facts_wrong_fact: [LocalizedSchema],
    myths_facts_right_fact: [LocalizedSchema],
  },
  { timestamps: true }
);

export default mongoose.models.mythfacts ||
  mongoose.model<IMythFact>('mythfacts', MythFactSchema);
