import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BACKEND_URL, getCsrfToken } from "../../lib";

export type Player = { id: number; handle: string };

export type GameState = {
    state_data: { board_state: ("X" | "O" | null)[] };
    created_at: string;
};

export type GameData = {
    join_code: string;
    in_progress: boolean;
    creator: Player;
    opponent: Player | null;
    created_at: string;
    states: GameState[];
};

type SliceState = {
    current: GameData | null;
    fetchStatus: "idle" | "loading" | "succeeded" | "failed";
    fetchError: string | null;
    creating: boolean;
    createError: string | null;
    newGame: { join_code: string; handle: string } | null;
    joining: boolean;
    joinError: string | null;
    movePending: boolean;
    moveError: string | null;
};

const initialState: SliceState = {
    current: null,
    fetchStatus: "idle",
    fetchError: null,
    creating: false,
    createError: null,
    newGame: null,
    joining: false,
    joinError: null,
    movePending: false,
    moveError: null,
};

export const fetchGame = createAsyncThunk(
    "game/fetch",
    async ({ handle, joinCode }: { handle: string; joinCode: string }, { rejectWithValue }) => {
        const res = await fetch(`${BACKEND_URL}/api/player/${handle}/game/${joinCode}`, {
            credentials: "include",
        });
        if (!res.ok) return rejectWithValue(`${res.status} ${res.statusText}`);
        return (await res.json()) as GameData;
    }
);

export const createGame = createAsyncThunk(
    "game/create",
    async (handle: string, { rejectWithValue }) => {
        const res = await fetch(`${BACKEND_URL}/api/player/${handle}/game`, {
            method: "POST",
            credentials: "include",
            headers: { "X-CSRFToken": getCsrfToken() },
        });
        if (!res.ok) return rejectWithValue(`${res.status} ${res.statusText}`);
        const data = await res.json() as { join_code: string };
        return { join_code: data.join_code, handle };
    }
);

export const joinGame = createAsyncThunk(
    "game/join",
    async ({ handle, joinCode }: { handle: string; joinCode: string }, { rejectWithValue }) => {
        const res = await fetch(`${BACKEND_URL}/api/player/${handle}/game/${joinCode}/join`, {
            method: "POST",
            credentials: "include",
            headers: { "X-CSRFToken": getCsrfToken() },
        });
        if (!res.ok) return rejectWithValue(`${res.status} ${res.statusText}`);
        const data = await res.json() as { join_code?: string; error?: string };
        if (data.error) return rejectWithValue(data.error);
        return { handle, joinCode };
    }
);

export const makeMove = createAsyncThunk(
    "game/makeMove",
    async (
        { handle, joinCode, cellIndex }: { handle: string; joinCode: string; cellIndex: number },
        { rejectWithValue }
    ) => {
        const res = await fetch(
            `${BACKEND_URL}/api/player/${handle}/game/${joinCode}/move`,
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCsrfToken(),
                },
                body: JSON.stringify({ cell_index: cellIndex }),
            }
        );
        if (!res.ok) return rejectWithValue(`${res.status} ${res.statusText}`);
        const data = await res.json() as { error?: string } & GameData;
        if (data.error) return rejectWithValue(data.error);
        return data as GameData;
    }
);

const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
        clearGame(state) {
            state.current = null;
            state.fetchStatus = "idle";
            state.fetchError = null;
        },
        clearNewGame(state) {
            state.newGame = null;
            state.createError = null;
        },
        gameUpdated(state, action: { payload: GameData }) {
            state.current = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchGame.pending, (state) => {
                state.fetchStatus = "loading";
                state.fetchError = null;
            })
            .addCase(fetchGame.fulfilled, (state, action) => {
                state.fetchStatus = "succeeded";
                state.current = action.payload;
            })
            .addCase(fetchGame.rejected, (state, action) => {
                state.fetchStatus = "failed";
                state.fetchError = action.payload as string;
            })
            .addCase(createGame.pending, (state) => {
                state.creating = true;
                state.createError = null;
                state.newGame = null;
            })
            .addCase(createGame.fulfilled, (state, action) => {
                state.creating = false;
                state.newGame = action.payload;
            })
            .addCase(createGame.rejected, (state, action) => {
                state.creating = false;
                state.createError = action.payload as string;
            })
            .addCase(joinGame.pending, (state) => {
                state.joining = true;
                state.joinError = null;
            })
            .addCase(joinGame.fulfilled, (state) => {
                state.joining = false;
            })
            .addCase(joinGame.rejected, (state, action) => {
                state.joining = false;
                state.joinError = action.payload as string;
            })
            .addCase(makeMove.pending, (state) => {
                state.movePending = true;
                state.moveError = null;
            })
            .addCase(makeMove.fulfilled, (state, action) => {
                state.movePending = false;
                state.current = action.payload;
            })
            .addCase(makeMove.rejected, (state, action) => {
                state.movePending = false;
                state.moveError = action.payload as string;
            });
    },
});

export const { clearGame, clearNewGame, gameUpdated } = gameSlice.actions;
export default gameSlice.reducer;
