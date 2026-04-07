import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BACKEND_URL, getCsrfToken } from "../../lib";

type AuthState = {
    username: string | null;
    status: "idle" | "loading" | "succeeded" | "failed";
};

const initialState: AuthState = { username: null, status: "idle" };

export const fetchSession = createAsyncThunk("auth/fetchSession", async () => {
    const res = await fetch(`${BACKEND_URL}/_allauth/browser/v1/auth/session`, {
        credentials: "include",
    });
    if (!res.ok) return null;
    const body = await res.json() as { data?: { user?: { username?: string } } };
    return body?.data?.user?.username ?? null;
});

export const signOut = createAsyncThunk("auth/signOut", async () => {
    await fetch(`${BACKEND_URL}/_allauth/browser/v1/auth/session`, {
        method: "DELETE",
        credentials: "include",
        headers: { "X-CSRFToken": getCsrfToken() },
    });
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSession.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchSession.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.username = action.payload ?? null;
            })
            .addCase(fetchSession.rejected, (state) => {
                state.status = "failed";
                state.username = null;
            })
            .addCase(signOut.fulfilled, (state) => {
                state.username = null;
            });
    },
});

export default authSlice.reducer;
