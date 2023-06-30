import { create } from "zustand";

type AppFormData = {
  phoneFile: Blob | string;
  templateFile: Blob | string;
  mediaFile?: Blob | string;
  minDelay: number;
  maxDelay: number;
};

type Store = {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  completedSteps: Set<number>;
  isAuthDone: boolean;
  setIsAuthDone: (isAuthDone: boolean) => void;
  isFormStarted: boolean;
  setIsFormStarted: (isFormStarted: boolean) => void;
  phoneListFileName: string;
  templateFileName: string;
  mediaName: string;
  appFormData: AppFormData;
  progress: number;
  setProgress: (progress: number) => void;
};

const useStore = create<Store>()((set) => ({
  currentStep: 0,
  setCurrentStep: (step: number) => set((state) => ({ currentStep: step })),
  completedSteps: new Set(),
  isAuthDone: false,
  setIsAuthDone: (isAuthDone: boolean) => set((state) => ({ isAuthDone })),
  isFormStarted: false,
  setIsFormStarted: (isFormStarted: boolean) =>
    set((state) => ({ isFormStarted })),
  phoneListFileName: "",
  templateFileName: "",
  mediaName: "",
  appFormData: {
    phoneFile: "",
    templateFile: "",
    mediaFile: "",
    minDelay: 1,
    maxDelay: 2,
  },
  progress: 0,
  setProgress: (progress: number) => set((state) => ({ progress })),
}));

export default useStore;
