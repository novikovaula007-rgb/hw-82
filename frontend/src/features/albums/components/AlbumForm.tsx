import {z} from "zod";
import {useNavigate} from "react-router";
import {useAppDispatch, useAppSelector} from "../../../app/hooks.ts";
import {useEffect, useState} from "react";
import type {IAlbumForm} from "../../../../types";
import {Box, Button, MenuItem, Stack, TextField, Typography} from "@mui/material";
import FileInput from "../../../components/UI/FileInput/FileInput.tsx";
import {createAlbum} from "../store/albumsSlice.ts";
import {fetchArtists, selectArtists} from "../../artists/store/artistsSlice.ts";


const albumSchema = z.object({
    title: z.string().min(1, "Title is required."),
    release_year: z.string().min(1, "Release year is required.").refine((val) => {
        const parsed = parseFloat(val);
        return !isNaN(parsed) && parsed > 1900;
    }, {
        message: "Release year must be at least 1900."
    }),
    artist: z.string().min(1, "Artist is required")
});

const AlbumForm = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [loadingForm, setLoadingForm] = useState<boolean>(false);
    const artists = useAppSelector(selectArtists);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const [form, setForm] = useState<IAlbumForm>({
        title: "",
        artist: "",
        release_year: null,
        description: "",
        image: null,
    });

    const submitFormHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoadingForm(true);
            const validationResult = albumSchema.safeParse(form);

            if (!validationResult.success) {
                const newErrors: { [key: string]: string } = {};

                validationResult.error._zod.def.forEach(field => {
                    const indexPath = field.path[0] as string;
                    newErrors[indexPath] = field.message;
                });
                setErrors(newErrors);
            } else {
                await dispatch(createAlbum({...form, release_year: Number(form.release_year)}));
                setForm({
                    title: "",
                    artist: "",
                    release_year: null,
                    description: "",
                    image: null,
                })
                navigate("/");
            }
        } catch (e) {
            console.log(e);
        } finally {
            setLoadingForm(false);
        }
    };

    const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setForm(prevState => {
            return {...prevState, [name]: value}
        })
    };

    const fileInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, files} = e.target;
        if (files) {
            setForm(prevState => ({
                ...prevState, [name]: files[0]
            }));
        }
    };

    useEffect(() => {
        dispatch(fetchArtists());
    }, [dispatch]);

    return artists && (
        <Box component="form" sx={{maxWidth: 450, mx: "auto"}} onSubmit={submitFormHandler}>
            <Stack spacing={2}>
                <Typography sx={{textAlign: "center", fontSize: "35px"}}>Create album</Typography>
                <TextField
                    select
                    id="artist" label="Artist"
                    value={form.artist}
                    onChange={inputChangeHandler}
                    name="artist"
                    error={!!errors.artist}
                    helperText={errors.artist}
                    disabled={loadingForm}
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
                >
                    <MenuItem value=" " disabled>Select artist</MenuItem>
                    {artists.map(artist => (
                        <MenuItem key={artist._id} value={artist._id}>{artist.name}</MenuItem>
                    ))}
                </TextField>

                <TextField
                    multiline rows={1}
                    id="title" label="Title"
                    value={form.title}
                    onChange={inputChangeHandler}
                    disabled={loadingForm}
                    name="title"
                    error={!!errors.title}
                    helperText={errors.title}
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

                <TextField
                    multiline rows={3}
                    id="description" label="Description"
                    value={form.description}
                    onChange={inputChangeHandler}
                    disabled={loadingForm}
                    name="description"
                    error={!!errors.description}
                    helperText={errors.description}
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

                <TextField
                    multiline rows={1}
                    id="release_year" label="Release year"
                    value={form.release_year}
                    onChange={inputChangeHandler}
                    disabled={loadingForm}
                    name="release_year"
                    error={!!errors.release_year}
                    helperText={errors.release_year}
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

                <FileInput
                    label="image"
                    name="image"
                    onChange={fileInputChangeHandler}
                    error={!!errors.image}
                    helperText={errors.image}
                />
                <Button disabled={loadingForm} type="submit" variant="contained" loading={loadingForm}
                        sx={{mt: 3, mb: 2, backgroundColor: "secondary.main"}}>
                    Create an album
                </Button>
            </Stack>
        </Box>
    );
};

export default AlbumForm;