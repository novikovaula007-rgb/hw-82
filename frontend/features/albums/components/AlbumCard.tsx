import {Box, Typography} from "@mui/material";
import * as React from "react";
import "../AlbumStyles.css";
import {NavLink} from "react-router-dom";

interface Props {
    id: string;
    title: string,
    release_year: number,
    image: string | null
}

const ArtistCard: React.FC<Props> = ({id, title, release_year, image}) => {
    let initialPhoto = 'https://i.ytimg.com/vi/w6geNk3QnBQ/sddefault.jpg';
    if (image) initialPhoto = `http://localhost:8000/${image}`;

    return (
        <Box className='album-card-wrapper' component={NavLink} to={`/album/${id}`}>
            <img src={initialPhoto} className='album-photo' alt={title}/>
            <Box className='album-text-wrapper'>
                <Typography className='album-title' variant='h6'>
                    {title}
                </Typography>
                <Typography className='release-year' sx={{fontSize: '14px'}}>
                    {release_year}
                </Typography>
            </Box>

        </Box>
    );
};

export default ArtistCard;