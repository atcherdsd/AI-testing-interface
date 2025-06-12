import { configureStore } from '@reduxjs/toolkit';
import progressReducer from './slices/progessSlice';
import imagesReducer from './slices/imagesSlice';
import modalReducer from './slices/modalSlice';

export const store = configureStore({
    reducer: {
        progress: progressReducer,
        images: imagesReducer,
        modal: modalReducer
    },
    devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
