import { z } from 'zod';

export const mobileSchema = z.object({
  mobile: z.string().regex(/^[6-9]\d{9}$/, 'Invalid mobile number'),
});

export const personalInfoSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  dob: z.string().min(1, 'Date of birth is required'),
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format'),
});

export const addressSchema = z.object({
  address: z.string().min(10, 'Address must be at least 10 characters'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Invalid pincode'),
});

export const professionalInfoSchema = z.object({
  occupation: z.string().min(1, 'Occupation is required'),
  income: z.string().min(1, 'Annual income is required'),
});

export const investmentInfoSchema = z.object({
  investmentExperience: z.string().min(1, 'Investment experience is required'),
  investmentGoal: z.string().min(1, 'Investment goal is required'),
});

export const riskProfileSchema = z.object({
  riskProfile: z.string().min(1, 'Risk profile is required'),
});
