import type {IArtist} from "../../../types";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {axiosAPI} from "../../../axiosAPI";
import type {RootState} from "../../../app/store.ts";

interface artistsState {
    items: IArtist[],
    loading: {
        loadingAllArtists: boolean
    }
}

const initialState: artistsState = {
    items: [],
    loading: {
        loadingAllArtists: false
    }
};

export const fetchArtists = createAsyncThunk<IArtist[], void>(
    "artists/fetchArtists",
    async () => {
        const response = await axiosAPI.get<IArtist[]>("artists");
        return response.data;
    }
)

const artistsSlice = createSlice({
    name: "artists",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchArtists.pending, (state) => {
                state.loading.loadingAllArtists = true;
            })
            .addCase(fetchArtists.fulfilled, (state, {payload: artists}) => {
                state.loading.loadingAllArtists = false;
                state.items = artists;
            })
            .addCase(fetchArtists.rejected, (state) => {
                state.loading.loadingAllArtists = false;
            })
    }
});

export const selectArtists = (state: RootState) => state.artists.items;
export const selectArtistsLoading = (state: RootState) => state.artists.loading;

export const artistsReducer = artistsSlice.reducer;