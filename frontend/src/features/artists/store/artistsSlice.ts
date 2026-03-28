import type {IArtist} from "../../../types";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {axiosAPI} from "../../../axiosAPI";
import type {RootState} from "../../../app/store.ts";

interface artistsState {
    items: IArtist[],
    selectedItem: IArtist | null,
    loading: {
        loadingAllArtists: boolean
    }
}

const initialState: artistsState = {
    items: [],
    selectedItem: null,
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

export const fetchSelectedArtist = createAsyncThunk<IArtist, string>(
    'artists/fetchSelectedArtist',
    async (id) => {
        const response = await axiosAPI.get<IArtist>(`/artists/${id}`);
        return response.data;
    }
);

const artistsSlice = createSlice({
    name: "artists",
    initialState,
    reducers: {
        clearSelectedArtist: (state) => {
            state.selectedItem = null;
        }
    },
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
            .addCase(fetchSelectedArtist.pending, (state) => {
                state.loading.loadingAllArtists = true;
            }).addCase(fetchSelectedArtist.fulfilled, (state, {payload}) => {
                state.loading.loadingAllArtists = false;
                state.selectedItem = payload;
            }).addCase(fetchSelectedArtist.rejected, (state) => {
                state.loading.loadingAllArtists = false;
            });
    }
});

export const selectArtists = (state: RootState) => state.artists.items;
export const selectArtistsLoading = (state: RootState) => state.artists.loading;
export const selectSelectedArtist = (state: RootState) => state.artists.selectedItem;

export const {clearSelectedArtist} = artistsSlice.actions;
export const artistsReducer = artistsSlice.reducer;