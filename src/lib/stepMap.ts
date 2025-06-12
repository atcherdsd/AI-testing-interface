import Step1 from '@/app/components/steps/Step1/Step1';
import Step2 from '@/app/components/steps/Step2/Step2';
import Step3 from '@/app/components/steps/Step3/Step3';

export const stepComponents = {
  1: Step1,
  2: Step2,
  3: Step3,
} as const;

export type StepId = keyof typeof stepComponents;
