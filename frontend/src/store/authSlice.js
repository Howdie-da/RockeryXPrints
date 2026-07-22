import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCurrentUser, loginUser, logoutUser } from "../services/api";
import { clearCart } from "./cartSlice";

export const fetchCurrentUser = createAsyncThunk(
    "auth/fetchCurrentUser",
    async (_, { rejectWithValue }) => {
        try {
            const res = await getCurrentUser();
            return res.data?.data || null;
        } catch (err) {
            return rejectWithValue(null);
        }
    }
);

export const login = createAsyncThunk(
    "auth/login",
    async (credentials, { rejectWithValue }) => {
        try {
            const res = await loginUser(credentials);
            return res.data?.data?.user || res.data?.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Login failed");
        }
    }
);

export const logoutThunk = createAsyncThunk(
    "auth/logout",
    async (_, { dispatch }) => {
        try {
            await logoutUser();
        } catch (e) {
            console.error("Logout API error:", e);
        } finally {
            dispatch(authSlice.actions.logout());
            dispatch(clearCart());
        }
    }
);

const initialState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
            const userData = action.payload?.user !== undefined ? action.payload.user : action.payload;
            state.user = userData;
            state.isAuthenticated = !!userData;
            state.error = null;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
        },
        clearAuthError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCurrentUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = !!action.payload;
            })
            .addCase(fetchCurrentUser.rejected, (state) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.error = action.payload;
            });
    }
});

export const { setUser, logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;