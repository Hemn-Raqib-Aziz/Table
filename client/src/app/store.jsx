import {configureStore} from '@reduxjs/toolkit';
import dataSlice from '../features/Data'
import uiSlice from '../features/UI'

const store = configureStore({
    reducer: {
        data: dataSlice,
        ui: uiSlice
    }
})

export default store;