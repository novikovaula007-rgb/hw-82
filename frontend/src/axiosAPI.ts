import axios from "axios";

export const axiosAPI = axios.create({
    baseURL: "http://localhost:8000"
});

axiosAPI.defaults.withCredentials = true;