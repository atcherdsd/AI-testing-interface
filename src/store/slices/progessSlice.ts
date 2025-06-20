import { totalSteps } from '@/lib/steps';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProgressState {
    currentStep: number;
}

const initialState: ProgressState = {
    currentStep: 0,
};

const progressSlice = createSlice({
    name: 'progress',
    initialState,
    reducers: {
        nextStep(state) {
            if (state.currentStep < totalSteps)
                state.currentStep++;
        },
        prevStep(state) {
            if (state.currentStep > 1)
                state.currentStep--;
        },
        setStep: (state, action: PayloadAction<number>) => {
            if (action.payload >= 1 && action.payload <= totalSteps)
                state.currentStep = action.payload;
        },
    },
});

export const { nextStep, prevStep, setStep } = progressSlice.actions;
export default progressSlice.reducer;
