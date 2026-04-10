import axios from "axios";
import type {RootState} from "./app/store.ts";
import type {Store} from "@reduxjs/toolkit";

export const axiosAPI = axios.create({
    baseURL: "http://localhost:8000/"
});

export const addAxiosInterceptors = (store: Store<RootState>) => {
    axiosAPI.interceptors.request.use((config) => {
        const token = store.getState().users.user?.token;
        if (token) {
            config.headers.Authorization = token;
        }
        return config;
    });
};