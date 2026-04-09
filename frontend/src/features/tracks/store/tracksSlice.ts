import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {axiosAPI} from "../../../axiosAPI";
import type {RootState} from "../../../app/store.ts";
import type {ITrack, ITrackForm} from "../../../../types";
import {toast} from "react-toastify";
import {isAxiosError} from "axios";

interface tracksState {
    items: ITrack[],
    loading: {
        loadingAllTracks: boolean
    }
}

const initialState: tracksState = {
    items: [],
    loading: {
        loadingAllTracks: false
    }
};

export const fetchTracks = createAsyncThunk<ITrack[], string>(
    "tracks/fetchTracks",
    async (id) => {
        const response = await axiosAPI.get<ITrack[]>(`tracks?album=${id}`);
        return response.data;
    }
);

export const createTrack = createAsyncThunk<void, ITrackForm, { state: RootState }>(
    'tracks/createTrack',
    async (trackData, {getState}) => {
        const token = getState().users.user?.token;

        const response = await axiosAPI.post<{ message: string, track: ITrack }>('/tracks', trackData, {
            headers: {
                'Authorization': token
            }
        });

        toast.success(response.data.message);
    }
);

export const toggleTrackPublished = createAsyncThunk<void, {
    trackID: string;
    albumID: string;
}, { rejectValue: string }>(
    'tracks/togglePublished',
    async ({trackID, albumID}, {rejectWithValue, dispatch}) => {
        try {
            await axiosAPI.patch(`/tracks/${trackID}/togglePublished`);
            await dispatch(fetchTracks(albumID));

        } catch (e) {
            if (isAxiosError(e) && e.response && e.response.status === 400) {
                return rejectWithValue(e.response.data);
            }
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
    }
});

export const selectTracks = (state: RootState) => state.tracks.items;
export const selectTracksLoading = (state: RootState) => state.tracks.loading;

export const {clearTracks} = tracksSlice.actions;

export const tracksReducer = tracksSlice.reducer;