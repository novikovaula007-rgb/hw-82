import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {axiosAPI} from "../../../axiosAPI";
import type {RootState} from "../../../app/store.ts";
import type {ITrackHistory} from "../../../../types";

interface trackHistoryState {
    items: ITrackHistory[],
    loading: {
        loadingAllTracks: boolean
    }
}

const initialState: trackHistoryState = {
    items: [],
    loading: {
        loadingAllTracks: false
    }
};

export const addNewEntry = createAsyncThunk<void, string, { state: RootState }>(
    "trackHistory/addNewEntry",
    async (trackID, {getState}) => {
        const token = getState().users.user?.token;
        await axiosAPI.post('track_history', {track: trackID}, {
            headers: {
                'Authorization': token
            }
        });
    }
);

export const fetchTrackHistory = createAsyncThunk<ITrackHistory[], void, { state: RootState }>(
    "trackHistory/fetchTrackHistory",
    async (_, {getState}) => {
        const token = getState().users.user?.token;
        const response = await axiosAPI.get<ITrackHistory[]>('track_history', {
            headers: {
                'Authorization': token
            }
        });
        return response.data;
    }
);

const trackHistorySlice = createSlice({
    name: "trackHistory",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTrackHistory.pending, (state) => {
                state.loading.loadingAllTracks = true;
            })
            .addCase(fetchTrackHistory.fulfilled, (state, {payload: tracks}) => {
                state.loading.loadingAllTracks = false;
                state.items = tracks;
            })
            .addCase(fetchTrackHistory.rejected, (state) => {
                state.loading.loadingAllTracks = false;
            })
    }
});

export const selectTrackHistory = (state: RootState) => state.trackHistory.items;
export const selectTrackHistoryLoading = (state: RootState) => state.trackHistory.loading;

export const trackHistoryReducer = trackHistorySlice.reducer;