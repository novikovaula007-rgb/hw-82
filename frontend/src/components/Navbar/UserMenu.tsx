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
            <Button component={NavLink} to='/track-history' color="inherit">
                Track history
            </Button>
            <Button color="inherit" onClick={handleLogout}>
                Log out
            </Button>
        </>
    );
};

export default UserMenu;