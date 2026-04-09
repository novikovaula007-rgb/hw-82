import {z} from "zod";
import {useNavigate} from "react-router";
import {useAppDispatch, useAppSelector} from "../../../app/hooks.ts";
import {useEffect, useState} from "react";
import type {ITrackForm} from "../../../../types";
import {Box, Button, MenuItem, Stack, TextField, Typography} from "@mui/material";
import {fetchAlbums, selectAlbums} from "../../albums/store/albumsSlice.ts";
import {createTrack} from "../store/tracksSlice.ts";


const trackSchema = z.object({
    title: z.string().min(1, "Title is required."),
    duration: z.string().min(1, "Duration is required."),
    album: z.string().min(1, "Album is required")
});

const TrackForm = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [loadingForm, setLoadingForm] = useState<boolean>(false);
    const albums = useAppSelector(selectAlbums);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const [form, setForm] = useState<ITrackForm>({
        title: "",
        duration: "",
        album: ""
    });

    const submitFormHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoadingForm(true);
            const validationResult = trackSchema.safeParse(form);

            if (!validationResult.success) {
                const newErrors: { [key: string]: string } = {};

                validationResult.error._zod.def.forEach(field => {
                    const indexPath = field.path[0] as string;
                    newErrors[indexPath] = field.message;
                });
                setErrors(newErrors);
            } else {
                await dispatch(createTrack(form));
                setForm({
                    title: "",
                    duration: "",
                    album: ""
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

    useEffect(() => {
        dispatch(fetchAlbums(null));
    }, [dispatch]);

    return albums && (
        <Box component="form" sx={{maxWidth: 450, mx: "auto"}} onSubmit={submitFormHandler}>
            <Stack spacing={2}>
                <Typography sx={{textAlign: "center", fontSize: "35px"}}>Create track</Typography>
                <TextField
                    select
                    id="album" label="Album"
                    value={form.album}
                    onChange={inputChangeHandler}
                    name="album"
                    error={!!errors.album}
                    helperText={errors.album}
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
                    <MenuItem value=" " disabled>Select album</MenuItem>
                    {albums.map(album => (
                        <MenuItem key={album._id} value={album._id}>{album.title}</MenuItem>
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
                    multiline rows={1}
                    id="duration" label="Duration"
                    value={form.duration}
                    onChange={inputChangeHandler}
                    disabled={loadingForm}
                    name="duration"
                    error={!!errors.duration}
                    helperText={errors.duration}
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
                
                <Button disabled={loadingForm} type="submit" variant="contained" loading={loadingForm}
                        sx={{mt: 3, mb: 2, backgroundColor: "secondary.main"}}>
                    Create an track
                </Button>
            </Stack>
        </Box>
    );
};

export default TrackForm;