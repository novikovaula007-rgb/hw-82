import axios from "axios";
import {API_URL} from "./constants.ts";

export const axiosAPI = axios.create({
    baseURL: API_URL,
});

axiosAPI.defaults.withCredentials = true;