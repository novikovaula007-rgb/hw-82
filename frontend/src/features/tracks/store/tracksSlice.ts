import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {axiosAPI} from "../../../axiosAPI";
import type {AppDispatch, RootState} from "../../../app/store.ts";
import type {ITrack, ITrackForm} from "../../../../types";
import {toast} from "react-toastify";
import {isAxiosError} from "axios";

interface tracksState {
    items: ITrack[],
    loading: {
        loadingAllTracks: boolean,
        deleteLoading: string | null
    }
}

const initialState: tracksState = {
    items: [],
    loading: {
        loadingAllTracks: false,
        deleteLoading: null
    }
};

export const fetchTracks = createAsyncThunk<ITrack[], string>(
    "tracks/fetchTracks",
    async (id) => {
        const response = await axiosAPI.get<ITrack[]>(`tracks?album=${id}`);
        return response.data;
    }
);

export const createTrack = createAsyncThunk<void, ITrackForm>(
    'tracks/createTrack',
    async (trackData) => {
        const response = await axiosAPI.post<{ message: string, track: ITrack }>('/tracks', trackData);
        toast.success(response.data.message);
    }
);

export const toggleTrackPublished = createAsyncThunk<ITrack, {
    trackID: string;
    albumID: string;
}, {
    rejectValue: string,
    dispatch: AppDispatch,
}>(
    'tracks/togglePublished',
    async ({trackID, albumID}, {rejectWithValue, dispatch}) => {
        try {
            const response = await axiosAPI.patch<{
                message: string,
                track: ITrack
            }>(`/tracks/${trackID}/togglePublished`);
            toast.success(response.data.message);
            await dispatch(fetchTracks(albumID));
            return response.data.track;
        } catch (e) {
            const errorMessage = isAxiosError(e) && e.response?.data?.error
                ? e.response.data.error
                : 'Something went wrong';

            toast.error(errorMessage);
            return rejectWithValue(errorMessage);
        }
    }
);

export const deleteTrack = createAsyncThunk<string, string, { rejectValue: string }>(
    'tracks/delete',
    async (id, {rejectWithValue}) => {
        try {
            const response = await axiosAPI.delete<{ message: string }>(`/tracks/${id}`);
            toast.success(response.data.message);
            return id;
        } catch (e) {
            const errorMessage = isAxiosError(e) && e.response?.data?.error
                ? e.response.data.error
                : 'Something went wrong';

            toast.error(errorMessage);
            return rejectWithValue(errorMessage);
        }
    }
);

const tracksSlice = createSlice({
    name: "tracks",
    initialState,
    reducers: {
        clearTracks: (state) => {
            state.items = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTracks.pending, (state) => {
                state.loading.loadingAllTracks = true;
            })
            .addCase(fetchTracks.fulfilled, (state, {payload: tracks}) => {
                state.loading.loadingAllTracks = false;
                state.items = tracks;
            })
            .addCase(fetchTracks.rejected, (state) => {
                state.loading.loadingAllTracks = false;
            })
            .addCase(toggleTrackPublished.fulfilled, (state, {payload}) => {
                const index = state.items.findIndex(track => track._id === payload._id);

                if (index !== -1) {
                    state.items[index].isPublished = payload.isPublished;
                }
            })
            .addCase(deleteTrack.pending, (state, {meta}) => {
                state.loading.deleteLoading = meta.arg;
            })
            .addCase(deleteTrack.fulfilled, (state, {payload}) => {
                const updatedItems = state.items.filter(track => track._id !== payload);

                state.items = updatedItems
                    .sort((a, b) => a.track_number - b.track_number)
                    .map((track, index) => ({
                        ...track,
                        track_number: index + 1
                    }));
                state.loading.deleteLoading = null;
            })
            .addCase(deleteTrack.rejected, (state) => {
                state.loading.deleteLoading = null;
            });
    }
});

export const selectTracks = (state: RootState) => state.tracks.items;
export const selectTracksLoading = (state: RootState) => state.tracks.loading;
export const {clearTracks} = tracksSlice.actions;

export const tracksReducer = tracksSlice.reducer;