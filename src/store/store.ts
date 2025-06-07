import { configureStore } from '@reduxjs/toolkit';
import progressReducer from './slices/progessSlice';

export const store = configureStore({
    reducer: {
        progress: progressReducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
