import {Box, Typography} from "@mui/material";
import * as React from "react";
import "../ArtistStyles.css";
import {NavLink} from "react-router-dom";

interface Props {
    photo: string | null,
    name: string,
    id: string
}

const ArtistCard: React.FC<Props> = ({photo, name, id}) => {
    let initialPhoto = 'https://i.ytimg.com/vi/w6geNk3QnBQ/sddefault.jpg';
    if (photo) initialPhoto = `http://localhost:8000/${photo}`;

    return (
        <Box className='artist-card-wrapper' component={NavLink} to={`/artist/${id}`}>
            <img src={initialPhoto} className='artist-photo' alt={name}/>
            <Typography className='artist-name' variant='h5'>
                {name}
            </Typography>
        </Box>
    );
};

export default ArtistCard;