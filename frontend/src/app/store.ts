import {configureStore} from "@reduxjs/toolkit";
import {artistsReducer} from "../features/artists/store/artistsSlice.ts";
import {albumsReducer} from "../features/albums/store/AlbumsSlice.ts";
import {tracksReducer} from "../features/tracks/store/tracksSlice.ts";
import {trackHistoryReducer} from "../features/trackHistory/store/trackHistorySlice.ts";

export const store = configureStore({
    reducer: {
        artists: artistsReducer,
        albums: albumsReducer,
        tracks: tracksReducer,
        trackHistory: trackHistoryReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;