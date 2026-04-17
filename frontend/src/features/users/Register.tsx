import React, {useState} from 'react';
import {Avatar, Box, Button, Container, Grid, TextField, Typography} from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {Link, useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {register, selectRegisterError} from './store/usersSlice.ts';
import type {IRegisterMutation} from "../../../types";
import AuthButtons from "./components/AuthButtons.tsx";
import FileInput from "../../components/UI/FileInput/FileInput.tsx";
import {toast} from "react-toastify";

const Register = () => {
    const dispatch = useAppDispatch();
    const error = useAppSelector(selectRegisterError);
    const navigate = useNavigate();
    const [form, setForm] = useState<IRegisterMutation>({
        username: '',
        password: '',
        avatar: null,
        displayName: '',
    });

    const [loadingForm, setLoadingForm] = useState<boolean>(false);

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setForm(prevState => {
            return {...prevState, [name]: value}
        })
    };

    const onSubmitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!form.username || !form.password || !form.displayName) {
                toast.error('Not all required fields are filled in.');
                return;
            }
            setLoadingForm(true);
            await dispatch(register(form)).unwrap();
            navigate('/');
        } catch (e) {
            console.log(e)
        } finally {
            setLoadingForm(false);
        }
    };

    const fileInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, files} = e.target;
        if (files) {
            setForm(prevState => ({
                ...prevState, [name]: files[0]
            }));
        }
    };

    const getFieldError = (fieldName: string) => {
        try {
            return error?.errors[fieldName].message;
        } catch {
            return undefined;
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Avatar sx={{m: 1, backgroundColor: "secondary.main"}}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <Box component="form" noValidate onSubmit={onSubmitHandler} sx={{mt: 3}}>
                    <Grid container spacing={2}>
                        <Grid size={12}>
                            <TextField
                                autoComplete="given-name"
                                name="username"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                disabled={loadingForm}
                                autoFocus
                                value={form.username}
                                onChange={onInputChange}
                                error={Boolean(getFieldError("username"))}
                                helperText={getFieldError("username")}
                                sx={{
                                    '& label.Mui-focused': {color: 'secondary.main'},
                                    '& .MuiOutlinedInput-root': {
                                        '&:hover fieldset': {
                                            borderColor: 'secondary.main',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'secondary.main',
                                        },
                                    },
                                }}
                            />
                        </Grid>
                        <Grid size={12}>
                            <TextField
                                name="displayName"
                                required
                                fullWidth
                                id="displayName"
                                label="Display name"
                                error={Boolean(getFieldError("displayName"))}
                                helperText={getFieldError("displayName")}
                                value={form.displayName}
                                onChange={onInputChange}
                                sx={{
                                    "& label.Mui-focused": {color: "secondary.main"},
                                    "& .MuiOutlinedInput-root": {
                                        "&:hover fieldset": {
                                            borderColor: "secondary.main",
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: "secondary.main",
                                        },
                                    },
                                }}
                            />
                        </Grid>
                        <FileInput
                            label="Avatar"
                            name="avatar"
                            onChange={fileInputChangeHandler}
                        />
                        <Grid size={12}>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                disabled={loadingForm}
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                value={form.password}
                                onChange={onInputChange}
                                error={Boolean(getFieldError("password"))}
                                helperText={getFieldError("password")}
                                sx={{
                                    '& label.Mui-focused': {color: 'secondary.main'},
                                    '& .MuiOutlinedInput-root': {
                                        '&:hover fieldset': {
                                            borderColor: 'secondary.main',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'secondary.main',
                                        },
                                    },
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        disabled={loadingForm}
                        loading={loadingForm}
                        variant="contained"
                        sx={{mt: 3, mb: 1, backgroundColor: "secondary.main"}}
                    >
                        Sign Up
                    </Button>
                    <AuthButtons/>
                    <Grid container justifyContent="flex-end">
                        <Grid>
                            <Typography component={Link} to="/login" sx={{
                                textDecoration: "none",
                                fontSize: "16px",
                                color: "text.secondary",
                                transition: "color 0.3s ease",
                                "&:hover": {
                                    color: "#ccc",
                                    cursor: "pointer"
                                }
                            }}>
                                Already have an account? Sign in
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};

export default Register;