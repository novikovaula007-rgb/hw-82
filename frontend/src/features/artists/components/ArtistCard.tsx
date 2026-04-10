import {Avatar, Box, Typography} from "@mui/material";
import React from "react";
import "../ArtistStyles.css";
import {NavLink} from "react-router-dom";
import CardChip from "../../../components/UI/CardChip/CardChip.tsx";
import CardOverlay from "../../../components/UI/CardOverlay/CardOverlay.tsx";

interface Props {
    photo: string | null,
    name: string,
    id: string,
    isPublished: boolean,
}

const ArtistCard: React.FC<Props> = ({photo, name, id, isPublished}) => {
    return (
        <Box className='artist-card-wrapper' component={NavLink} to={`/artist/${id}`} sx={{position: 'relative'}}>
            {!isPublished && (<>
                <CardOverlay/>
                <CardChip text={'Not published'}/>
            </>)}
            <Avatar src={`http://localhost:8000/${photo}`}
                    sx={{width: 200, height: 200, boxShadow: 2, marginBottom: '20px'}}/>
            <Typography className='artist-name' variant='h5'>
                {name}
            </Typography>
        </Box>
    );
};

export default ArtistCard;