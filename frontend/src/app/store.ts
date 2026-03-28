import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {artistsReducer} from "../features/artists/store/artistsSlice.ts";
import {FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE} from 'redux-persist';
import storage from 'redux-persist/es/storage';
import {albumsReducer} from "../features/albums/store/AlbumsSlice.ts";
import {tracksReducer} from "../features/tracks/store/tracksSlice.ts";
import {trackHistoryReducer} from "../features/trackHistory/store/trackHistorySlice.ts";
import {usersReducer} from "../features/users/store/usersSlice.ts";

const userPersistConfig = {
    key: 'store:users',
    storage,
    whitelist: ['user'],
};

const rootReducer = combineReducers({
    artists: artistsReducer,
    albums: albumsReducer,
    tracks: tracksReducer,
    trackHistory: trackHistoryReducer,
    users: persistReducer(userPersistConfig, usersReducer)
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;