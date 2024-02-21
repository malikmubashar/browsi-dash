import { configureStore } from '@reduxjs/toolkit';
import appReducers from './reducers';

const store = configureStore({
    reducer: appReducers
});

export default store;