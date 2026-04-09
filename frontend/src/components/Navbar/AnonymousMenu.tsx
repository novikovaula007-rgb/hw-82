import {Button} from "@mui/material";
import {NavLink} from "react-router-dom";

const AnonymousMenu = () => {
    return (
        <>
            <Button component={NavLink} to='/register' color="inherit" sx={{margin: "0 15px"}}>
                Sign Up
            </Button>
            |
            <Button component={NavLink} to='/login' color="inherit" sx={{margin: "0 15px"}}>
                Sign In
            </Button>
        </>
    );
};

export default AnonymousMenu;