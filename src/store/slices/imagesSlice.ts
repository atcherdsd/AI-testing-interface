import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface ImagesState {
    urls: (string | null)[];
    taskId?: string;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error?: string;
}

const initialState: ImagesState = {
    urls: [null, null, null],
    status: 'idle'
};

interface UploadResponse {
    task_id: string;
}

const uploadErrorMessage = 'Upload failed';

export const uploadImages = createAsyncThunk<
    UploadResponse,
    File[],
    { rejectValue: string }
>(
    'images/upload',
    async (files, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            files.forEach((file) => formData.append('file', file));

            const url = process.env.NEXT_PUBLIC_API_URL!;

            if (process.env.NEXT_PUBLIC_USE_MOCK_API === 'true') {
                await new Promise(res => setTimeout(res, 2000));
            }

            const res = await fetch(
                url, {
                    method: 'POST',
                    body: formData
                }
            );
            if (!res.ok) throw new Error(uploadErrorMessage);

            const data = await res.json();
            if (!data.task_id) {
                return rejectWithValue('Сервер не вернул task_id');
            }

            return data as UploadResponse;
        } catch (e) {
            const isNetworkError
                = e instanceof TypeError || (e as Error).message === uploadErrorMessage;

            if (
                process.env.NEXT_PUBLIC_USE_MOCK_ON_FAILURE === 'true' &&
                isNetworkError
            ) {
                console.warn('[uploadImages] Сервер недоступен, использован моковый task_id');
                return {
                    task_id: 'mock-task-id-' + Date.now(), __mock: true
                } as UploadResponse & { __mock: true };
            }

            return rejectWithValue((e as Error).message || 'Unknown error');
        }
    }
);

const imagesSlice = createSlice({
    name: 'images',
    initialState,
    reducers: {
        setImage: (
            state,
            action: PayloadAction<{ index: number; url: string }>
        ) => {
            state.urls[action.payload.index] = action.payload.url;
        },
        resetImage: (state, action: PayloadAction<number>) => {
            state.urls[action.payload] = null;
        },
        resetAll: (state) => {
            state.urls = [null, null, null];
            state.taskId = undefined;
            state.status = 'idle';
            state.error = undefined;
        },
        clearError(state) {
            state.error = undefined;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(uploadImages.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(uploadImages.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.taskId = action.payload.task_id;
            })
            .addCase(uploadImages.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export const selectAllUploaded = (state: RootState) =>
    state.images.urls.every((url) => url !== null);

export const { setImage, resetImage, resetAll, clearError } = imagesSlice.actions;
export default imagesSlice.reducer;
