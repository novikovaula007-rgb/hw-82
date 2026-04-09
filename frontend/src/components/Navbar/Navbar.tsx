import {AppBar, Box, Button, Toolbar, Typography} from "@mui/material";
import {NavLink} from "react-router-dom";
import {useAppSelector} from "../../app/hooks.ts";
import {selectUser} from "../../features/users/store/usersSlice.ts";
import UserMenu from "./UserMenu.tsx";
import AnonymousMenu from "./AnonymousMenu.tsx";

const NavBar = () => {
    const user = useAppSelector(selectUser);

    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position='static' sx={{backgroundColor: '#171717', top: 0, left: 0, right: 0}}>
                <Toolbar>
                    <Typography variant='h6'
                                sx={{flexGrow: 1, textDecoration: 'none', color: 'white'}}
                                component={NavLink}
                                to='/'>
                        Music app
                    </Typography>

                    <Button color='inherit' to='/' component={NavLink} sx={{margin: "0 15px"}}>Artists</Button>
                    {user ? <UserMenu/> : <AnonymousMenu/>}
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default NavBar;