import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BACKEND_URL } from "../../lib";

type Player = { id: number; handle: string };

type Game = {
    join_code: string;
    in_progress: boolean;
    creator: Player;
    opponent: Player | null;
    created_at: string;
};

export type PlayerDetail = {
    id: number;
    handle: string;
    created_games: Game[];
    joined_games: Game[];
};

type PlayerState = {
    data: PlayerDetail | null;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
};

const initialState: PlayerState = { data: null, status: "idle", error: null };

export const fetchPlayer = createAsyncThunk(
    "player/fetch",
    async (handle: string, { rejectWithValue }) => {
        const res = await fetch(`${BACKEND_URL}/api/player/${handle}`, {
            credentials: "include",
        });
        if (res.status === 404) return null;
        if (!res.ok) return rejectWithValue(`${res.status} ${res.statusText}`);
        return (await res.json()) as PlayerDetail;
    }
);

const playerSlice = createSlice({
    name: "player",
    initialState,
    reducers: {
        clearPlayer(state) {
            state.data = null;
            state.status = "idle";
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPlayer.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchPlayer.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.data = action.payload;
            })
            .addCase(fetchPlayer.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            });
    },
});

export const { clearPlayer } = playerSlice.actions;
export default playerSlice.reducer;
