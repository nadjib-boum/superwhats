import { type ReactElement, useState, useCallback } from "react";
import useStore from "../store";

type MultiStepFormHook = {
  currentStep: number;
  setStep: (step: number) => void;
  step: ReactElement;
  isFirstStep: boolean;
  isLastStep: boolean;
  next(): void;
  back(): void;
};

export const useMultiStepForm = (steps: ReactElement[]): MultiStepFormHook => {
  const { currentStep, setCurrentStep } = useStore();
  const next = (): void => {
    setCurrentStep(
      currentStep >= steps.length - 1 ? currentStep : currentStep + 1
    );
  };
  const back = useCallback((): void => {
    setCurrentStep(currentStep <= 0 ? currentStep : currentStep - 1);
  }, [currentStep]);
  const setStep = useCallback((index: number) => {
    setCurrentStep(index);
  }, []);
  return {
    currentStep,
    setStep,
    step: steps[currentStep],
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === steps.length - 1,
    next,
    back,
  };
};
