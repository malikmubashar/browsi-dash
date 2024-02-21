import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    searchQuery: '',
    dialog: {
        current: null,
        props: {}
    },
    idb: {},
    isSelectionMode: false,
    homeScreen: 0,
    appScreen: 0
}

const app = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setDialog: (state, { payload }) => {
            state.dialog = payload;
        },
        setSelectionMode: (state, { payload }) => {
            state.isSelectionMode = payload;
        },
        updateHomeScreen: (state, a) => {
            state.homeScreen += 1;
        },
        updateAppScreen: (state, a) => {
            state.appScreen += 1;
        }
    },
});

export const {
    setDialog,
    setSelectionMode,
    updateHomeScreen,
    updateAppScreen
} = app.actions;
export default app.reducer;