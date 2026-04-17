import {createSlice} from "@reduxjs/toolkit";
import {createAsyncThunk} from "@reduxjs/toolkit";
import type {
    IGlobalError,
    ILoginMutation,
    IRegisterMutation,
    IUser,
    IValidationError
} from "../../../../types";
import {isAxiosError} from "axios";
import {toast} from "react-toastify";
import {axiosAPI} from "../../../axiosAPI.ts";
import type {RootState} from "../../../app/store.ts";

interface UsersState {
    user: IUser | null;
    logoutLoading: boolean;
    logoutError: boolean;
    registerLoading: boolean;
    registerError: IValidationError | null;
    loginLoading: boolean;
    loginError: IGlobalError | null;
}

const initialState: UsersState = {
    user: null,
    logoutLoading: false,
    logoutError: false,
    registerLoading: false,
    registerError: null,
    loginLoading: false,
    loginError: null,
};

export const register = createAsyncThunk<IUser, IRegisterMutation, { rejectValue: IValidationError }>(
    'users/register',
    async (registerMutation, {rejectWithValue}) => {
        try {
            const formData = new FormData();

            const keys = Object.keys(registerMutation) as (keyof IRegisterMutation)[];

            keys.forEach(key => {
                const value = registerMutation[key];
                if (value !== null && value !== undefined) {
                    if (value instanceof File) {
                        formData.append(key, value);
                    } else {
                        formData.append(key, String(value));
                    }
                }
            })

            const response = await axiosAPI.post<{ user: IUser, message: string }>('/users', formData);
            toast.success(response.data.message);
            return response.data.user;
        } catch (e) {
            if (isAxiosError(e) && e.response && e.response.status === 400) {
                return rejectWithValue(e.response.data);
            }
            throw e;
        }
    }
);

export const login = createAsyncThunk<IUser, ILoginMutation, { rejectValue: IGlobalError }>(
    'users/login',
    async (loginMutation, {rejectWithValue}) => {
        try {
            const response = await axiosAPI.post<{ user: IUser, message: string }>('/users/sessions', loginMutation);
            toast.success(response.data.message);
            return response.data.user;
        } catch (e) {
            if (isAxiosError(e) && e.response && e.response.status === 400) {
                return rejectWithValue(e.response.data as IGlobalError);
            }
            throw e;
        }
    }
);

export const logout = createAsyncThunk<void, void>(
    'users/logout',
    async () => {
        const response = await axiosAPI.delete<{ message: string }>('/users/sessions');
        toast.success(response.data.message);
    }
);

export const googleLogin = createAsyncThunk<IUser, string, { rejectValue: IGlobalError }>(
    'users/googleLogin',
    async (credential, {rejectWithValue}) => {
        try {
            const response = await axiosAPI.post<{ user: IUser, message: string }>('users/google', {credential});
            return response.data.user;
        } catch (e) {
            if (isAxiosError(e) && e.response && e.response.status === 400) {
                return rejectWithValue(e.response.data as IGlobalError);
            }
            throw e;
        }
    }
);

export const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(register.pending, (state) => {
            state.registerLoading = true;
            state.registerError = null;
        });
        builder.addCase(register.fulfilled, (state, {payload: user}) => {
            state.registerLoading = false;
            state.user = user;
        });
        builder.addCase(register.rejected, (state, {payload: error}) => {
            state.registerLoading = false;
            state.registerError = error || null;
        });

        builder.addCase(login.pending, (state) => {
            state.loginLoading = true;
            state.loginError = null;
        });
        builder.addCase(login.fulfilled, (state, {payload: user}) => {
            state.loginLoading = false;
            state.user = user;
        });
        builder.addCase(login.rejected, (state, {payload: error}) => {
            state.loginLoading = false;
            state.loginError = error || null;
        });

        builder.addCase(logout.pending, (state) => {
            state.logoutLoading = true;
            state.logoutError = false;
        });
        builder.addCase(logout.fulfilled, (state) => {
            state.logoutLoading = false;
            state.user = null;
        });
        builder.addCase(logout.rejected, (state) => {
            state.logoutLoading = false;
            state.logoutError = true;
        });
        builder.addCase(googleLogin.pending, (state) => {
            state.loginLoading = true;
            state.loginError = null;
        });
        builder.addCase(googleLogin.fulfilled, (state, {payload: user}) => {
            state.loginLoading = false;
            state.user = user;
        });
        builder.addCase(googleLogin.rejected, (state, {payload: error}) => {
            state.loginLoading = false;
            state.loginError = error || null;
        });
    }
});

export const selectUser = (state: RootState) => state.users.user;
export const selectRegisterError = (state: RootState) => state.users.registerError;
export const selectLoginError = (state: RootState) => state.users.loginError;

export const usersReducer = usersSlice.reducer;