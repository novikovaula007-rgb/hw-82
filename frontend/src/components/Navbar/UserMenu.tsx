import {Button} from "@mui/material";
import {NavLink} from "react-router-dom";
import {useNavigate} from "react-router";
import {useAppDispatch} from "../../app/hooks.ts";
import {logout} from "../../features/users/store/usersSlice.ts";

const UserMenu = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    return (
        <>
            <Button component={NavLink} to='/track-history' color="inherit" sx={{margin: "0 15px"}}>
                Track history
            </Button>
            <Button component={NavLink} to='/tracks/new' color="inherit" sx={{margin: "0 15px"}}>
                New track
            </Button>
            <Button component={NavLink} to='/albums/new' color="inherit" sx={{margin: "0 15px"}}>
                New album
            </Button>
            <Button component={NavLink} to='/artists/new' color="inherit" sx={{margin: "0 15px"}}>
                New artist
            </Button>
            <Button color="inherit" onClick={handleLogout} sx={{margin: "0 15px"}}>
                Log out
            </Button>
        </>
    );
};

export default UserMenu;