import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProgressState {
    currentStep: number;
    taskId: string | null;
}

const initialState: ProgressState = {
    currentStep: 0,
    taskId: null,
};

const progressSlice = createSlice({
    name: 'progress',
    initialState,
    reducers: {
        nextStep(state) {
            state.currentStep += 1;
        },
        prevStep(state) {
            state.currentStep = Math.max(0, state.currentStep - 1);
        },
        setStep: (state, action: PayloadAction<number>) => {
            state.currentStep = action.payload;
        },
        setTaskId: (state, action: PayloadAction<string>) => {
            state.taskId = action.payload;
        },
    },
});

export const { nextStep, prevStep, setStep, setTaskId } = progressSlice.actions;
export default progressSlice.reducer;
