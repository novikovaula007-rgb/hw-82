import {Avatar, Box, Typography} from "@mui/material";
import * as React from "react";
import "../ArtistStyles.css";
import {NavLink} from "react-router-dom";

interface Props {
    photo: string | null,
    name: string,
    id: string
}

const ArtistCard: React.FC<Props> = ({photo, name, id}) => {
    return (
        <Box className='artist-card-wrapper' component={NavLink} to={`/artist/${id}`}>
            <Avatar src={`http://localhost:8000/${photo}`} sx={{width: 200, height: 200, boxShadow: 2, marginBottom: '20px'}}/>
            <Typography className='artist-name' variant='h5'>
                {name}
            </Typography>
        </Box>
    );
};

export default ArtistCard;