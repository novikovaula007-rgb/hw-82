import {Avatar, Box, Button, IconButton, Menu, MenuItem} from "@mui/material";
import {NavLink} from "react-router-dom";
import {useNavigate} from "react-router";
import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {logout, selectUser} from "../../features/users/store/usersSlice.ts";
import {fetchArtists} from "../../features/artists/store/artistsSlice.ts";
import React, {useState} from "react";
import {API_URL} from "../../constants.ts";

const UserMenu = () => {
    const user = useAppSelector(selectUser);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        await dispatch(logout()).unwrap();
        await dispatch(fetchArtists());
        navigate('/');
    };

    let userAvatar: string | null = API_URL + '/';

    if (user) {
        if (user.googleID) userAvatar = user.avatar;
        if (!user.googleID && user.avatar) userAvatar = userAvatar + user.avatar;
    }

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
            {user && <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                <span>Hello, {user.displayName}!</span>

                <IconButton onClick={handleOpen}>
                    <Avatar src={userAvatar || undefined}/>
                </IconButton>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={async () => {
                        handleClose();
                        await handleLogout();
                    }}>
                        Log out
                    </MenuItem>
                </Menu>
            </Box>}
        </>
    );
};

export default UserMenu;