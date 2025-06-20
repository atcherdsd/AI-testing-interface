import { FormSchema } from "@/lib/schemas/questionsFormSchema";
import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { format } from "date-fns";

export interface SubmitSurveyResponse {
    message: string;
    task_id: string;
}
interface SurveyState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error?: string;
    // для реального режима:
    serverResponse?: SubmitSurveyResponse;
    // для mock/demo:
    mockMarkdown?: string;
}

const initialState: SurveyState = {
    status: 'idle',
    error: undefined,
    serverResponse: undefined,
    mockMarkdown: undefined
};

export const submitSurvey = createAsyncThunk<
    string | SubmitSurveyResponse,
    void,
    { state: RootState; rejectValue: string }
>(
    'survey/submit',
    async (_, { getState, rejectWithValue }) => {
        const state = getState();
        const isDemo = state.images.isDemo;

        const taskId = state.images.taskId;
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

        // Приведение данных к схеме сервера:
        const surveyObj: Record<string, string> = {
            childName: formData.childName,
            childDOB: dateOnly,
            childGender: formData.gender,
            parentName: formData.parentName,
        };

        for (let sec = 1; sec <= 4; sec++) {
            const sectionKey = `section${sec}` as keyof FormSchema;
            const section = formData[sectionKey] as Record<string, string> | undefined;
            if (section) {
                for (let q = 1; q <= 10; q++) {
                    const fieldKey = `q${q}`;
                    const answer = section[fieldKey];
                    // название поля на сервере
                    const serverKey = `q${sec}_${q}`;
                    surveyObj[serverKey] = answer;
                }
            }
        }
        surveyObj.emotionalState = formData.section5.radio;

        const payload =
            (process.env.NEXT_PUBLIC_USE_MOCK_API === 'true' || isDemo)
            ? { ...formData, birthDate: dateOnly, task_id: taskId }
            : { task_id: taskId, survey: surveyObj };

        try {
            const url = (process.env.NEXT_PUBLIC_USE_MOCK_API === 'true' || isDemo)
                ? '/api/submit-survey'
                : process.env.NEXT_PUBLIC_API_SURVEY_URL!;

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

            if (process.env.NEXT_PUBLIC_USE_MOCK_API === 'true' || isDemo) {
                await new Promise(res => setTimeout(res, 2000));
                const markdown = await res.text();
                return markdown;
            } else {
                const data = await res.json();

                // runtime-проверка {message, task_id}
                if (
                    typeof data === 'object' &&
                    data !== null &&
                    typeof data.message === 'string' &&
                    typeof data.task_id === 'string'
                ) {
                    return data as SubmitSurveyResponse;
                } else {
                    return rejectWithValue('Неверный формат ответа сервера');
                }
            }
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
            state.serverResponse = undefined;
            state.mockMarkdown = undefined;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(submitSurvey.pending, state => {
                state.status = 'loading';
                state.error = undefined;
                state.serverResponse = undefined;
                state.mockMarkdown = undefined;
            })
            .addCase(submitSurvey.fulfilled, (state, action) => {
                state.status = 'succeeded';
                if (typeof action.payload === 'string') {
                    state.mockMarkdown = action.payload;
                } else {
                    state.serverResponse = action.payload;
                }
            })
            .addCase(submitSurvey.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ?? action.error.message;
                state.serverResponse = undefined;
                state.mockMarkdown = undefined;
            });
    }
});

export const { resetSurveyState } = surveySlice.actions;
export const selectSurvey = createSelector(
    (state: RootState) => state.survey,
    (survey) => ({
        surveyStatus: survey.status,
        surveyError: survey.error,
        mockMarkdown: survey.mockMarkdown,
        serverResponse: survey.serverResponse,
    })
);

export default surveySlice.reducer;
