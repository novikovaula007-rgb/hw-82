import type {IAlbum} from "../../../types";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {axiosAPI} from "../../../axiosAPI";
import type {RootState} from "../../../app/store.ts";

interface albumsState {
    items: IAlbum[],
    loading: {
        loadingAllAlbums: boolean
    }
}

const initialState: albumsState = {
    items: [],
    loading: {
        loadingAllAlbums: false
    }
};

export const fetchAlbums = createAsyncThunk<IAlbum[], string>(
    "albums/fetchAlbums",
    async (id) => {
        const response = await axiosAPI.get<IAlbum[]>(`albums?artist=${id}`);
        return response.data;
    }
)

const albumsSlice = createSlice({
    name: "albums",
    initialState,
    reducers: {
        clearAlbums: (state) => {
            state.items = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAlbums.pending, (state) => {
                state.loading.loadingAllAlbums = true;
            })
            .addCase(fetchAlbums.fulfilled, (state, {payload: albums}) => {
                state.loading.loadingAllAlbums = false;
                state.items = albums;
            })
            .addCase(fetchAlbums.rejected, (state) => {
                state.loading.loadingAllAlbums = false;
            })
    }
});

export const selectAlbums = (state: RootState) => state.albums.items;
export const selectAlbumsLoading = (state: RootState) => state.albums.loading;

export const {clearAlbums} = albumsSlice.actions;

export const albumsReducer = albumsSlice.reducer;