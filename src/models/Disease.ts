 
import mongoose, { Schema, Document } from 'mongoose';
 

 
const MultiLangSchema = new Schema({
  en: { type: String },
  kn: { type: String }
}, { _id: false });

 

 
const WhatIsDiseaseDescriptionRepeaterSchema = new Schema({
  what_is_disease_heading_repeat: { type: MultiLangSchema },
  what_is_disease_description_repeat: { type: MultiLangSchema }
}, { _id: true });

 
const WhatIsDiseaseRepeatSchema = new Schema({
  what_is_disease_repeat_images: { type: [String] },
  what_is_disease_heading: { type: MultiLangSchema },
  what_is_disease_disease_repeat_icon: { type: String },
 
  what_is_disease_description_repeater: { type: [WhatIsDiseaseDescriptionRepeaterSchema] }
}, { _id: true });

 
const CauseRepeatSchema = new Schema({
  cause_repeat_title: { type: MultiLangSchema },
  cause_repeat_description: { type: MultiLangSchema },
  cause_repeat_icon: { type: String }
}, { _id: true });

 
const SymptomsRepeatSchema = new Schema({
  symptoms_repeat_title: { type: MultiLangSchema },
  symptoms_repeat_description: { type: MultiLangSchema },
  symptoms_repeat_icon: { type: String }
}, { _id: true });

 
const PreventionTipsRepeatSchema = new Schema({
  prevention_tips_repeat_title: { type: MultiLangSchema },
  prevention_tips_repeat_description: { type: MultiLangSchema },
  prevention_tips_repeat_icon: { type: String }
}, { _id: true });

 
const TreatmentOptionRepeatSchema = new Schema({
  treatment_option_repeat_title: { type: MultiLangSchema },
  treatment_option_repeat_description: { type: MultiLangSchema },
  treatment_option_repeat_icon: { type: String }
}, { _id: true });

 

const CauseSchema = new Schema({
  cause_title: { type: MultiLangSchema },
  cause_icon: { type: String },
  cause_para: { type: MultiLangSchema },
  cause_brief: { type: MultiLangSchema },
  cause_repeat: { type: [CauseRepeatSchema] }
}, { _id: true });

const SymptomsSchema = new Schema({
  symptoms_title: { type: MultiLangSchema },
  symptoms_icon: { type: String },
  symptoms_para: { type: MultiLangSchema },
  symptoms_brief: { type: MultiLangSchema },
  symptoms_repeat: { type: [SymptomsRepeatSchema] }
}, { _id: true });

const PreventionTipsSchema = new Schema({
  prevention_tips_title: { type: MultiLangSchema },
  prevention_tips_icon: { type: String },
  prevention_tips_para: { type: MultiLangSchema },
  prevention_tips_brief: { type: MultiLangSchema },
  prevention_tips_repeat: { type: [PreventionTipsRepeatSchema] }
}, { _id: true });

const TreatmentOptionSchema = new Schema({
  treatment_option_title: { type: MultiLangSchema },
  treatment_option_icon: { type: String },
  treatment_option_para: { type: MultiLangSchema },
  treatment_option_brief: { type: MultiLangSchema },
  treatment_option_repeat: { type: [TreatmentOptionRepeatSchema] }
}, { _id: false });

 

export interface IDisease extends Document {
  disease_main_title?: { en?: string; kn?: string };
  disease_main_image?: string;
  disease_slug?: { en?: string; kn?: string };

  disease_title?: { en?: string; kn?: string };
  disease_description?: { en?: string; kn?: string };
  disease_icon?: string;

  what_is_disease_tab_title?: { en?: string; kn?: string };
  what_is_disease_repeat?: {
    what_is_disease_repeat_images?: string[];
    what_is_disease_heading?: { en?: string; kn?: string };
    what_is_disease_disease_repeat_icon?: string;
    what_is_disease_description_repeater?: {
      what_is_disease_heading_repeat?: { en?: string; kn?: string };
      what_is_disease_description_repeat?: { en?: string; kn?: string };
    }[];
  }[];

  common_cause_tab_title?: { en?: string; kn?: string };
  common_cause?: {
    cause_title?: { en?: string; kn?: string };
    cause_icon?: string;
    cause_para?: { en?: string; kn?: string };
    cause_brief?: { en?: string; kn?: string };
    cause_repeat?: {
      cause_repeat_title?: { en?: string; kn?: string };
      cause_repeat_description?: { en?: string; kn?: string };
      cause_repeat_icon?: string;
    }[];
  }[];

  symptoms_tab_title?: { en?: string; kn?: string };
  symptoms?: {
    symptoms_title?: { en?: string; kn?: string };
    symptoms_icon?: string;
    symptoms_para?: { en?: string; kn?: string };
    symptoms_brief?: { en?: string; kn?: string };
    symptoms_repeat?: {
      symptoms_repeat_title?: { en?: string; kn?: string };
      symptoms_repeat_description?: { en?: string; kn?: string };
      symptoms_repeat_icon?: string;
    }[];
  }[];

  prevention_tips_tab_title?: { en?: string; kn?: string };
  prevention_tips?: {
    prevention_tips_title?: { en?: string; kn?: string };
    prevention_tips_icon?: string;
    prevention_tips_para?: { en?: string; kn?: string };
    prevention_tips_brief?: { en?: string; kn?: string };
    prevention_tips_repeat?: {
      prevention_tips_repeat_title?: { en?: string; kn?: string };
      prevention_tips_repeat_description?: { en?: string; kn?: string };
      prevention_tips_repeat_icon?: string;
    }[];
  }[];

  treatment_option_tab_title?: { en?: string; kn?: string };
  treatment_option?: {
    treatment_option_title?: { en?: string; kn?: string };
    treatment_option_icon?: string;
    treatment_option_para?: { en?: string; kn?: string };
    treatment_option_brief?: { en?: string; kn?: string };
    treatment_option_repeat?: {
      treatment_option_repeat_title?: { en?: string; kn?: string };
      treatment_option_repeat_description?: { en?: string; kn?: string };
      treatment_option_repeat_icon?: string;
    }[];
  }[];

  createdAt?: Date;
  updatedAt?: Date;
}

const DiseaseSchema = new Schema<IDisease>({
  disease_main_title: { type: MultiLangSchema },
  disease_main_image: { type: String },
  disease_slug: { type: MultiLangSchema },

  disease_title: { type: MultiLangSchema },
  disease_description: { type: MultiLangSchema },
  disease_icon: { type: String },

  what_is_disease_tab_title: { type: MultiLangSchema },
  what_is_disease_repeat: { type: [WhatIsDiseaseRepeatSchema] },

  common_cause_tab_title: { type: MultiLangSchema },
  common_cause: { type: [CauseSchema] },

  symptoms_tab_title: { type: MultiLangSchema },
  symptoms: { type: [SymptomsSchema] },

  prevention_tips_tab_title: { type: MultiLangSchema },
  prevention_tips: { type: [PreventionTipsSchema] },

  treatment_option_tab_title: { type: MultiLangSchema },
  treatment_option: { type: [TreatmentOptionSchema] }
}, { timestamps: true });

export default mongoose.models.diseases || mongoose.model<IDisease>('diseases', DiseaseSchema);
