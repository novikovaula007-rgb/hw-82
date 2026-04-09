import {z} from "zod";
import {useNavigate} from "react-router";
import {useAppDispatch} from "../../../app/hooks.ts";
import {useState} from "react";
import type {IArtistForm} from "../../../../types";
import {createArtist} from "../store/artistsSlice.ts";
import {Box, Button, Stack, TextField, Typography} from "@mui/material";
import FileInput from "../../../components/UI/FileInput/FileInput.tsx";


const artistSchema = z.object({
    name: z.string().min(1, "Name is required."),
});

const ArtistForm = () => {
    const navigate = useNavigate();

    const dispatch = useAppDispatch();
    const [loadingForm, setLoadingForm] = useState<boolean>(false);

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const [form, setForm] = useState<IArtistForm>({
        name: "",
        description: "",
        photo: null,
    });

    const submitFormHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoadingForm(true);
            const validationResult = artistSchema.safeParse(form);

            if (!validationResult.success) {
                const newErrors: { [key: string]: string } = {};

                validationResult.error._zod.def.forEach(field => {
                    const indexPath = field.path[0] as string;
                    newErrors[indexPath] = field.message;
                });
                setErrors(newErrors);
            } else {
                await dispatch(createArtist(form));
                setForm({
                    name: "",
                    description: "",
                    photo: null,
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

    return (
        <Box component="form" sx={{maxWidth: 450, mx: "auto"}} onSubmit={submitFormHandler}>
            <Stack spacing={2}>
                <Typography sx={{textAlign: "center", fontSize: "35px"}}>Create artist</Typography>

                <TextField
                    multiline rows={1}
                    id="name" label="Name"
                    value={form.name}
                    onChange={inputChangeHandler}
                    disabled={loadingForm}
                    name="name"
                    error={!!errors.name}
                    helperText={errors.name}
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

                <FileInput
                    label="photo"
                    name="photo"
                    onChange={fileInputChangeHandler}
                />
                <Button disabled={loadingForm} type="submit" variant="contained" loading={loadingForm}
                        sx={{mt: 3, mb: 2, backgroundColor: "secondary.main"}}>
                    Create an artist
                </Button>
            </Stack>
        </Box>
    );
};

export default ArtistForm;