import { create } from 'zustand';
import { Step, FormData, User } from '../types';

interface FormStore {
  step: Step;
  formData: Partial<FormData>;
  user: User | null;
  loading: boolean;
  error: string | null;
  
  setStep: (step: Step) => void;
  setFormData: (data: Partial<FormData>) => void;
  updateFormField: (field: keyof FormData, value: string) => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetForm: () => void;
}

export const useFormStore = create<FormStore>((set) => ({
  step: 'SPLASH',
  formData: {},
  user: null,
  loading: false,
  error: null,

  setStep: (step) => set({ step }),
  
  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),
  
  updateFormField: (field, value) =>
    set((state) => ({
      formData: { ...state.formData, [field]: value },
    })),
  
  setUser: (user) => set({ user }),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
  
  resetForm: () =>
    set({
      step: 'WELCOME',
      formData: {},
      error: null,
    }),
}));
