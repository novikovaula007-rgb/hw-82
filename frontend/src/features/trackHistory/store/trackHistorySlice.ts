import type {ITrackHistory} from "../../../types";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {axiosAPI} from "../../../axiosAPI";
import type {RootState} from "../../../app/store.ts";

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

export const addNewEntry = createAsyncThunk<void, string>(
    "trackHistory/addNewEntry",
    async (trackID) => {
        await axiosAPI.post('track_history', {track: trackID});
    }
);

export const fetchTrackHistory = createAsyncThunk<ITrackHistory[], void>(
    "trackHistory/fetchTrackHistory",
    async () => {
        const response = await axiosAPI.get<ITrackHistory[]>('track_history');
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