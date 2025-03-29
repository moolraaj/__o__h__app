type Language = { en: string; kn: string };

export interface UserSearchQuery {
  page: number;
  limit: number;
  role?: "admin" | "user" | "ambassador" | "super-admin";
  user: Users;
}


export interface Users {
  _id: string;
  name: string;
  email?: string;
  phoneNumber?: number;
  password?: string;
  role: "admin" | "user" | "ambassador" | "super-admin";
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
  role?: "admin" | "user" | "ambassador" | "super-admin";
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









