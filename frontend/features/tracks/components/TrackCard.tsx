import "../TrackStyles.css";
import {Box, Typography} from '@mui/material';
import * as React from "react";

interface Props {
    artist: string,
    title: string,
    duration: string,
    track_number: number
}

const TrackCard: React.FC<Props> = ({artist, title, duration, track_number}) => {
    return (
        <Box className="track-card-wrapper">
            <Box sx={{marginRight: '20px'}} color="text.secondary">
                <Typography sx={{fontSize: '15px'}}>
                    {track_number}
                </Typography>
            </Box>
            <Box sx={{flexGrow: 1}}>
                <Typography noWrap>
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                    {artist}
                </Typography>
            </Box>
            <Typography sx={{textAlign: 'right'}}>
                {duration}
            </Typography>
        </Box>
    );
};

export default TrackCard;