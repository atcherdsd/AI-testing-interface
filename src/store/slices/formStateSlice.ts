import { FormSchema } from "@/lib/schemas/questionsFormSchema";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface UpdateFieldPayload {
    path: string;
    value: unknown;
}

interface FormState {
    formData: Partial<FormSchema>;
    isValid: boolean;
}

const initialState: FormState = {
    formData: {},
    isValid: false
};

const formStateSlice = createSlice({
    name: 'formState',
    initialState,
    reducers: {
        setSurveyFormData(state, action: PayloadAction<Partial<FormSchema>>) {
            state.formData = { ...state.formData, ...action.payload };
        },
        updateField(state, action: PayloadAction<UpdateFieldPayload>) {
            const { path, value } = action.payload;

            const keys = path.split('.');
            // проверка formData на вложенные объекты
            let cur: Record<string, unknown> = state.formData as Record<string, unknown>;
            for (let i = 0; i < keys.length - 1; i++) {
                const k = keys[i];
                if (cur[k] == null || typeof cur[k] !== 'object') {
                    cur[k] = {};
                }
                cur = cur[k] as Record<string, unknown>;
            }
            cur[keys[keys.length - 1]] = value;
        },
        resetSurveyFormData(state) {
            state.formData = {};
            state.isValid = false;
        },
        setSurveyFormValid(state, action: PayloadAction<boolean>) {
            state.isValid = action.payload;
        }
    }
});


export const {
    setSurveyFormData,
    updateField,
    resetSurveyFormData,
    setSurveyFormValid
} = formStateSlice.actions;

export const selectSurveyFormData = (state: RootState) => state.formState.formData;
export const selectSurveyFormValid = (state: RootState) => state.formState.isValid;

export default formStateSlice.reducer;
