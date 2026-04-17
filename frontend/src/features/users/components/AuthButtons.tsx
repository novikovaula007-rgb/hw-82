import {GoogleLogin} from "@react-oauth/google";
import {Box} from "@mui/material";
import {googleLogin} from "../store/usersSlice.ts";
import {useAppDispatch} from "../../../app/hooks.ts";
import {useNavigate} from "react-router";

const AuthButtons = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const googleLoginHandler = async (credential: string) => {
        await dispatch(googleLogin(credential)).unwrap();
        navigate('/');
    };

    return (
        <Box sx={{mb: 1}}>
            <GoogleLogin onSuccess={(credentialResponse) => {
                if (credentialResponse.credential) {
                    void googleLoginHandler(credentialResponse.credential);
                }
            }} onError={() => {
                console.log('Login failed.');
            }}
            />
        </Box>
    );
};

export default AuthButtons;