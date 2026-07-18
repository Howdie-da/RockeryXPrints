import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    size: 0,
    products: []
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setCart: (state, action) => {
            state.products = action.payload
            state.size = action.payload.reduce((total, item) => total + item.quantity, 0)
        },
        addToCart: (state, action) => {
            const newItem = action.payload
            const existingItem = state.products.find(item => item.product._id === newItem.product._id)

            if (existingItem) {
                existingItem.quantity += newItem.quantity;
            } else {
                state.products.push(newItem);
            }
            state.size += newItem.quantity;
        },
        removeFromCart: (state, action) => {
            const productId = action.payload; 
            
            const existingItem = state.products.find(cartItem => cartItem.product._id === productId);

            if (existingItem) {
                state.size -= existingItem.quantity;
                state.products = state.products.filter(cartItem => cartItem.product._id !== productId);
            }
        },
        updateQuantity: (state, action) => {
            const { productId, quantity } = action.payload;
            const existingItem = state.products.find(item => item.product._id === productId);
            if (existingItem) {
                const newQty = Math.max(0, quantity);
                const diff = newQty - existingItem.quantity;
                if (newQty === 0) {
                    state.products = state.products.filter(item => item.product._id !== productId);
                } else {
                    existingItem.quantity = newQty;
                }
                state.size += diff;
            }
        },
        clearCart: (state, action) => {
            state.size = 0
            state.products = []
        }
    }
})

export const { setCart, addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer