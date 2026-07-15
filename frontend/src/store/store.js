import { configureStore } from '@reduxjs/toolkit'
import authSliceReducer from './authSlice.js'
import cartSliceReducer from './cartSlice.js'

const store = configureStore({
    reducer: {
        auth: authSliceReducer,
        cart: cartSliceReducer
    }
})

export { store }