import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {axiosAPI} from "../../../axiosAPI";
import type {RootState} from "../../../app/store.ts";
import type {IAlbum, IAlbumForm, IAlbumMutation} from "../../../../types";
import {toast} from "react-toastify";
import {isAxiosError} from "axios";

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

export const createAlbum = createAsyncThunk<void, IAlbumForm>(
    'albums/createAlbum',
    async (albumData) => {
        const formData = new FormData();

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

        const response = await axiosAPI.post<{ message: string, album: IAlbum }>('/albums', formData);
        toast.success(response.data.message);
    }
);

export const toggleAlbumPublished = createAsyncThunk<void, string, { rejectValue: string }>(
    'albums/togglePublished',
    async (id, {rejectWithValue, dispatch}) => {
        try {
            await axiosAPI.patch(`/albums/${id}/togglePublished`);
            await dispatch(fetchAlbums(null));
        } catch (e) {
            if (isAxiosError(e) && e.response && e.response.status === 400) {
                return rejectWithValue(e.response.data);
            }
        }
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