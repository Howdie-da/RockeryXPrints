import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addToCartAPI, updateCartQuantityAPI, removeFromCartAPI, getUserCart } from "../services/api";

const initialState = {
    size: 0,
    products: [],
    loading: false,
    error: null
};

export const fetchCart = createAsyncThunk(
    "cart/fetchCart",
    async (_, { rejectWithValue }) => {
        try {
            const res = await getUserCart();
            return res.data?.data || [];
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to load cart");
        }
    }
);

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setCart: (state, action) => {
            const items = action.payload || [];
            state.products = items;
            state.size = items.reduce((total, item) => total + (item.quantity || 0), 0);
        },
        addToCartLocal: (state, action) => {
            const newItem = action.payload;
            const existingItem = state.products.find(item => item.product._id === newItem.product._id);

            if (existingItem) {
                existingItem.quantity += newItem.quantity;
            } else {
                state.products.push(newItem);
            }
            state.size += newItem.quantity;
        },
        removeFromCartLocal: (state, action) => {
            const productId = action.payload;
            const existingItem = state.products.find(cartItem => cartItem.product._id === productId);

            if (existingItem) {
                state.size -= existingItem.quantity;
                state.products = state.products.filter(cartItem => cartItem.product._id !== productId);
            }
        },
        updateQuantityLocal: (state, action) => {
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
        clearCartLocal: (state) => {
            state.size = 0;
            state.products = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
                state.size = action.payload.reduce((total, item) => total + (item.quantity || 0), 0);
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

const { setCart, addToCartLocal, removeFromCartLocal, updateQuantityLocal, clearCartLocal } = cartSlice.actions;

export { setCart };

export const addToCart = (payload) => async (dispatch, getState) => {
    const previousState = getState().cart.products;
    dispatch(addToCartLocal(payload));
    const { auth } = getState();
    if (auth?.user) {
        try {
            await addToCartAPI({ productId: payload.product._id, quantity: payload.quantity });
        } catch (e) {
            console.error("Cart sync error, rolling back:", e);
            dispatch(setCart(previousState));
        }
    }
};

export const removeFromCart = (productId) => async (dispatch, getState) => {
    const previousState = getState().cart.products;
    dispatch(removeFromCartLocal(productId));
    const { auth } = getState();
    if (auth?.user) {
        try {
            await removeFromCartAPI(productId);
        } catch (e) {
            console.error("Cart sync error, rolling back:", e);
            dispatch(setCart(previousState));
        }
    }
};

export const updateQuantity = (payload) => async (dispatch, getState) => {
    const previousState = getState().cart.products;
    dispatch(updateQuantityLocal(payload));
    const { auth } = getState();
    if (auth?.user) {
        try {
            await updateCartQuantityAPI(payload.productId, payload.quantity);
        } catch (e) {
            console.error("Cart sync error, rolling back:", e);
            dispatch(setCart(previousState));
        }
    }
};

export const clearCart = () => async (dispatch) => {
    dispatch(clearCartLocal());
};

export default cartSlice.reducer;