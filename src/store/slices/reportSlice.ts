import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface ReportState {
    status: 'idle' | 'loading' | 'processing' | 'ready' | 'failed';
    error?: string;
    pdfUrl?: string;
    taskId?: string;
}

const initialState: ReportState = {
    status: 'idle',
};

export const fetchReportStatus = createAsyncThunk<
    { status: 'processing' } | { status: 'ready'; pdfUrl: string },
    void,
    { state: RootState; rejectValue: string }
>(
    'report/fetchStatus',
    async (_, { getState, rejectWithValue }) => {
        const state = getState();
        const taskId = state.survey.serverResponse?.task_id || state.report.taskId;

        if (!taskId) {
            return rejectWithValue('Нет task_id для запроса отчета');
        }

        try {
            const url = `${process.env.NEXT_PUBLIC_API_REPORT_URL}/${taskId}`;
            const res = await fetch(url);

            if (res.status === 404) {
                return { status: 'processing' };
            }
            if (!res.ok) {
                const text = await res.text();
                return rejectWithValue(`Ошибка сервера: ${res.status} ${text}`);
            }

            const data = await res.json();

            if (!data || typeof data.status !== 'string') {
                return rejectWithValue('Неверный формат ответа при запросе отчета');
            }

            const serverStatus: string = data.status;
            if (serverStatus === 'в обработке' || serverStatus === 'processing') {
                return { status: 'processing' };
            }

            if (serverStatus === 'ready' || serverStatus === 'готов') {
                const pdfUrl = data.pdf_url ?? data.pdfUrl;
                if (typeof pdfUrl === 'string' && pdfUrl) {
                    return { status: 'ready', pdfUrl };
                }
                return rejectWithValue('Сервер вернул некорректный ответ при готовом отчете');
            }
            return rejectWithValue(`Неизвестный статус отчета: ${serverStatus}`);
        } catch (e) {
            return rejectWithValue((e as Error).message);
        }
    }
);

const reportSlice = createSlice({
    name: 'report',
    initialState,
    reducers: {
        setTaskId(state, action: PayloadAction<string>) {
            state.taskId = action.payload;
        },
        resetReportState(state) {
            state.status = 'idle';
            state.error = undefined;
            state.pdfUrl = undefined;
            state.taskId = undefined;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchReportStatus.pending, state => {
                state.status = 'loading';
                state.error = undefined;
            })
            .addCase(fetchReportStatus.fulfilled, (state, action) => {
                if (action.payload.status === 'processing') {
                    state.status = 'processing';
                } else {
                    state.status = 'ready';
                    state.pdfUrl = action.payload.pdfUrl;
                }
            })
            .addCase(fetchReportStatus.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message;
            });
    }
});

export const { setTaskId, resetReportState } = reportSlice.actions;

export const selectReportState = (state: RootState) => state.report;

export default reportSlice.reducer;
