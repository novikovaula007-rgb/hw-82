import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {axiosAPI} from "../../../axiosAPI";
import type {RootState} from "../../../app/store.ts";
import type {IAlbum, IAlbumForm, IAlbumMutation} from "../../../../types";
import {toast} from "react-toastify";

interface albumsState {
    items: IAlbum[],
    selectedItem: IAlbumMutation | null,
    loading: {
        loadingAllAlbums: boolean
    }
}

const initialState: albumsState = {
    items: [],
    selectedItem: null,
    loading: {
        loadingAllAlbums: false
    }
};

export const fetchAlbums = createAsyncThunk<IAlbum[], string | null>(
    "albums/fetchAlbums",
    async (id) => {
        let stringFetch = 'albums';

        if (id !== null) {
            stringFetch += `?artist=${id}`
        }

        const response = await axiosAPI.get<IAlbum[]>(stringFetch);
        return response.data;
    }
)

export const fetchSelectedAlbum = createAsyncThunk<IAlbumMutation, string>(
    'albums/fetchSelectedAlbum',
    async (id) => {
        const response = await axiosAPI.get<IAlbumMutation>(`/albums/${id}`);
        return response.data;
    }
);

export const createAlbum = createAsyncThunk<void, IAlbumForm, { state: RootState }>(
    'albums/createAlbum',
    async (albumData, {getState}) => {
        const formData = new FormData();
        const token = getState().users.user?.token;

        const keys = Object.keys(albumData) as (keyof IAlbumForm)[];
        keys.forEach(key => {
            const value = albumData[key];
            if (value !== null && value !== undefined) {
                if (value instanceof File) {
                    formData.append(key, value);
                } else {
                    formData.append(key, String(value));
                }
            }
        });

        const response = await axiosAPI.post<{ message: string, album: IAlbum }>('/albums', formData, {
            headers: {
                'Authorization': token
            }
        });
        toast.success(response.data.message);
    }
);

const albumsSlice = createSlice({
    name: "albums",
    initialState,
    reducers: {
        clearAlbums: (state) => {
            state.items = [];
        },
        clearSelectedAlbum: (state) => {
            state.selectedItem = null;
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
            .addCase(fetchSelectedAlbum.pending, (state) => {
                state.loading.loadingAllAlbums = true;
            }).addCase(fetchSelectedAlbum.fulfilled, (state, {payload}) => {
            state.loading.loadingAllAlbums = false;
            state.selectedItem = payload;
        }).addCase(fetchSelectedAlbum.rejected, (state) => {
            state.loading.loadingAllAlbums = false;
        });
    }
});

export const selectAlbums = (state: RootState) => state.albums.items;
export const selectAlbumsLoading = (state: RootState) => state.albums.loading;
export const selectSelectedAlbum = (state: RootState) => state.albums.selectedItem;

export const {clearAlbums, clearSelectedAlbum} = albumsSlice.actions;

export const albumsReducer = albumsSlice.reducer;