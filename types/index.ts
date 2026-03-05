export type Step =
  | 'SPLASH'
  | 'WELCOME'
  | 'LOGIN'
  | 'STEP1_MOBILE'
  | 'STEP2_PERSONAL'
  | 'STEP3_PROFESSIONAL'
  | 'STEP4_INVESTMENT'
  | 'STEP5_RISK'
  | 'STEP6_REVIEW'
  | 'SUCCESS'
  | 'DASHBOARD';

export interface FormData {
  mobile: string;
  otp?: string;
  name: string;
  email: string;
  dob: string;
  pan: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  occupation: string;
  income: string;
  investmentExperience: string;
  investmentGoal: string;
  riskProfile: string;
}

export interface User {
  uid: string;
  mobile: string;
  email?: string;
  name?: string;
  formData?: FormData;
  registrationComplete: boolean;
  createdAt: number;
}
