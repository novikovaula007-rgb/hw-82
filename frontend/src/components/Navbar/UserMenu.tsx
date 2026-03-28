import {Button} from "@mui/material";
import {NavLink} from "react-router-dom";

const AnonymousMenu = () => {
    return (
        <>
            <Button component={NavLink} to='/track-history' color="inherit">
                Track history
            </Button>
            <Button color="inherit">
                Log out
            </Button>
        </>
    );
};

export default AnonymousMenu;