type Language = { en: string; kn: string };

export interface UserSearchQuery {
  page: number;
  limit: number;
  role?: "admin" | "user" | "dantasurakshaks" | "super-admin";
  user: Users;
}


export interface Users {
  _id: string;
  name: string;
  email?: string;
  phoneNumber?: number;
  password?: string;
  role: "admin" | "user" | "dantasurakshaks" | "super-admin";
  status: string;
}


 
export interface PaginatedUsersResponse {
  users: Users[];
  total: number;
  page: number;
  limit: number;
  roles: {
    admin: number;
    user: number;
    ambassador: number;
    [key: string]: number;  
  };
}



export interface GetUsersQueryParams {
  page?: number;
  limit?: number;
  role?: "admin" | "user" | "dantasurakshaks" | "super-admin";
}


export interface SBody {
  image: string;
  text: Language;
  description: Language;
  _id?: string;
}


 
export interface Slide {
  sliderImage: string;
  text: Language;
  description: Language;
  body: SBody[];
  _id: string;
}

export interface SliderResponse {
  result: Slide[];
  total: number;
  page: number;
  limit: number;
}

export interface GetSlidersQueryParams {
  page?: number;
  limit?: number;
  lang?: string;
}


export interface DentalCaries {
  en: string; kn: string

}


export interface FaqsWrongFacts {
  en: string; kn: string

}
export interface FaqsRightFacts {
  en: string; kn: string
}

export interface Faqs {
  _id: string,
  myth_fact_image: string,
  myth_fact_title: Language,
  myth_fact_body: Language,
  myth_fact_heading: Language,
  myth_fact_description: Language,
  myths_facts_wrong_fact: [FaqsWrongFacts]
  myths_facts_right_fact: [FaqsRightFacts]
  createdAt: Date,
  updatedAt: Date,
  __v: number
}


export interface CategoryType{
  _id: string,
  categoryImage: string,
  title: Language,
  createdAt: Date,
  updatedAt: Date,
}

export interface Lesion {
  fullName?: string;
  age?: number;
  gender?: string;
  contactNumber?: string;
  location?: string;
  symptoms?: string[] | string;
  duration?: number | string;
  habits?: string;
  previousDentalTreatments?: string[] | string;
  submittedBy?: string;
  images?: string[];
}




// disease

export interface MultiLang {
  en?: string;
  kn?: string;
}

 
export interface WhatIsDiseaseDescriptionRepeater {
  what_is_disease_heading_repeat: MultiLang;
  what_is_disease_description_repeat: MultiLang;
}

 
export interface WhatIsDiseaseRepeat {
  what_is_disease_repeat_images: string[];  
  what_is_disease_heading: MultiLang;
  what_is_disease_disease_repeat_icon: string;
  what_is_disease_description_repeater: WhatIsDiseaseDescriptionRepeater[];
}

 
export interface CauseRepeat {
  cause_repeat_title: MultiLang;
  cause_repeat_description: MultiLang;
  cause_repeat_icon: string;
}

 
export interface Cause {
  cause_title: MultiLang;
  cause_icon: string;
  cause_para: MultiLang;
  cause_brief: MultiLang;
  cause_repeat: CauseRepeat[];
}

 
export interface SymptomRepeat {
  symptoms_repeat_title: MultiLang;
  symptoms_repeat_description: MultiLang;
  symptoms_repeat_icon: string;
}

 
export interface Symptom {
  symptoms_title: MultiLang;
  symptoms_icon: string;
  symptoms_para: MultiLang;
  symptoms_brief: MultiLang;
  symptoms_repeat: SymptomRepeat[];
}

 
export interface PreventionTipRepeat {
  prevention_tips_repeat_title: MultiLang;
  prevention_tips_repeat_description: MultiLang;
  prevention_tips_repeat_icon: string;
}

 
export interface PreventionTip {
  prevention_tips_title: MultiLang;
  prevention_tips_icon: string;
  prevention_tips_para: MultiLang;
  prevention_tips_brief: MultiLang;
  prevention_tips_repeat: PreventionTipRepeat[];
}

 
export interface TreatmentOptionRepeat {
  treatment_option_repeat_title: MultiLang;
  treatment_option_repeat_description: MultiLang;
  treatment_option_repeat_icon: string;
}

 
export interface TreatmentOption {
  treatment_option_title: MultiLang;
  treatment_option_icon: string;
  treatment_option_para: MultiLang;
  treatment_option_brief: MultiLang;
  treatment_option_repeat: TreatmentOptionRepeat[];
}

 
export interface DiseaseTypes {
  _id: string;
  disease_main_title: MultiLang;
  disease_main_image: string;
  disease_slug: MultiLang;
  disease_title: MultiLang;
  disease_description: MultiLang;
  disease_icon: string;
  what_is_disease_tab_title: MultiLang;
  what_is_disease_repeat: WhatIsDiseaseRepeat[];
  common_cause_tab_title: MultiLang;
  common_cause: Cause[];
  symptoms_tab_title: MultiLang;
  symptoms: Symptom[];
  prevention_tips_tab_title: MultiLang;
  prevention_tips: PreventionTip[];
  treatment_option_tab_title: MultiLang;
  treatment_option: TreatmentOption[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}










