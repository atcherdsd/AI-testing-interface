import { FormSchema } from "@/lib/schemas/questionsFormSchema";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { format } from "date-fns";

const mockedId = '11111';

interface SurveyState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error?: string;
}

const initialState: SurveyState = {
    status: 'idle',
    error: undefined
};

export const submitSurvey = createAsyncThunk<
    void,
    void,
    { state: RootState; rejectValue: string }
>(
    'survey/submit',
    async (_, { getState, rejectWithValue }) => {
        const state = getState();
        const taskId =
            process.env.NEXT_PUBLIC_USE_MOCK_API === 'true'
            ? mockedId
            : state.images.taskId;
        const isValid = state.formState.isValid;
        const formDataPartial = state.formState.formData;

        if (!taskId) {
            return rejectWithValue('Нет task_id для отправки анкеты');
        }
        if (!isValid) {
            return rejectWithValue('Форма невалидна');
        }

        const formData = formDataPartial as FormSchema;
        // Приведение к формату "YYYY-MM-DD":
        const date = formData.birthDate;
        const dateOnly = format(date, 'yyyy-MM-dd');
        const payload = { ...formData, birthDate: dateOnly, task_id: taskId };

        console.log('payload: ', payload);

        try {
            const url = process.env.NEXT_PUBLIC_API_SURVEY_URL!;

            if (process.env.NEXT_PUBLIC_USE_MOCK_API === 'true') {
                await new Promise(res => setTimeout(res, 2000));
            }

            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const text = await res.text();
                return rejectWithValue(`Ошибка сервера: ${res.status} ${text}`);
            }

            return;
        } catch (e) {
            return rejectWithValue((e as Error).message);
        }
    }
);

const surveySlice = createSlice({
    name: 'survey',
    initialState,
    reducers: {
        resetSurveyState(state) {
            state.status = 'idle';
            state.error = undefined;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(submitSurvey.pending, state => {
                state.status = 'loading';
                state.error = undefined;
            })
            .addCase(submitSurvey.fulfilled, state => {
                state.status = 'succeeded';
            })
            .addCase(submitSurvey.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message;
            });
    }
});

export const { resetSurveyState } = surveySlice.actions;
export const selectSurveyStatus = (state: RootState) => state.survey.status;
export const selectSurveyError = (state: RootState) => state.survey.error;

export default surveySlice.reducer;
