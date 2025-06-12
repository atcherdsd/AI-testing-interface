import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ModalState {
    isOpen: boolean;
    message: string | null;
}

const initialState: ModalState = {
    isOpen: false,
    message: null,
}

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        showModal: (state, action: PayloadAction<string>) => {
            state.isOpen = true;
            state.message = action.payload;
        },
        hideModal: (state) => {
            state.isOpen = false;
            state.message = null;
        }
    }
});

export const { showModal, hideModal } = modalSlice.actions;
export default modalSlice.reducer;
