import {Avatar, Box, Typography} from "@mui/material";
import * as React from "react";
import "../AlbumStyles.css";
import {NavLink} from "react-router-dom";
import CardOverlay from "../../../components/UI/CardOverlay/CardOverlay.tsx";
import CardChip from "../../../components/UI/CardChip/CardChip.tsx";

interface Props {
    id: string;
    title: string,
    release_year: number,
    image: string | null,
    isPublished: boolean,
}

const ArtistCard: React.FC<Props> = ({id, title, release_year, image, isPublished}) => {
    return (
        <Box className='album-card-wrapper' component={NavLink} to={`/album/${id}`}>
            {!isPublished && (<>
                <CardOverlay/>
                <CardChip text={'Not published'}/>
            </>)}
            <Avatar src={`http://localhost:8000/${image}`} variant="rounded" sx={{width: 200, height: 200, boxShadow: 2, marginBottom: '20px'}}/>
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