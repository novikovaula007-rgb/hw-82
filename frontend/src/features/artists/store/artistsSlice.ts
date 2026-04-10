import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {axiosAPI} from "../../../axiosAPI";
import type {AppDispatch, RootState} from "../../../app/store.ts";
import type {IArtist, IArtistForm} from "../../../../types";
import {toast} from "react-toastify";
import {isAxiosError} from "axios";

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

export const createArtist = createAsyncThunk<void, IArtistForm>(
    'artists/createArtist',
    async (artistData) => {
        const formData = new FormData();

        const keys = Object.keys(artistData) as (keyof IArtistForm)[];
        keys.forEach(key => {
            const value = artistData[key];
            if (value !== null && value !== undefined) {
                if (value instanceof File) {
                    formData.append(key, value);
                } else {
                    formData.append(key, String(value));
                }
            }
        });

        const response = await axiosAPI.post<{ message: string, artist: IArtist }>('/artists');
        toast.success(response.data.message);
    }
);

export const toggleArtistPublished = createAsyncThunk<void, string, {
    rejectValue: string,
    dispatch: AppDispatch
}>(
    'artists/togglePublished',
    async (id, {rejectWithValue, dispatch}) => {
        try {
            await axiosAPI.patch(`/artists/${id}/togglePublished`);
            await dispatch(fetchArtists());
        } catch (e) {
            if (isAxiosError(e) && e.response && e.response.status === 400) {
                return rejectWithValue(e.response.data);
            }
        }
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