import {AppBar, Box, Button, Toolbar, Typography} from "@mui/material";
import {NavLink} from "react-router-dom";

const NavBar = () => {
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

                    <Button color='inherit' to='/' component={NavLink}>Artists</Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default NavBar;