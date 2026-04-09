import "../TrackStyles.css";
import {Avatar, Box, IconButton, Typography} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import * as React from "react";
import dayjs from "dayjs";
import {useAppDispatch, useAppSelector} from "../../../app/hooks.ts";
import {addNewEntry} from "../../trackHistory/store/trackHistorySlice.ts";
import {selectUser} from "../../users/store/usersSlice.ts";
import {toast} from "react-toastify";

interface Props {
    id: string,
    artist: string,
    title: string,
    duration: string,
    albumImage?: string | null,
    track_number?: number,
    album?: string,
    isHistory?: boolean,
    datetime?: Date
}

const TrackCard: React.FC<Props> = ({id, artist, title, duration, track_number, album, isHistory = false, datetime, albumImage}) => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);

    const toListenTrack = async () => {
        try {
            if (user) {
                await dispatch(addNewEntry(id));
            } else {
                toast.error('You must be logged in to listen to music.');
            }
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <Box className="track-card-wrapper">
            {track_number &&
                <Box color="text.secondary">
                    <Typography sx={{fontSize: '15px'}}>
                        {track_number}
                    </Typography>
                </Box>
            }
            {!isHistory && <IconButton onClick={() => toListenTrack()}>
                <PlayArrowIcon sx={{height: 38, width: 38}}/>
            </IconButton>}

            <Box sx={{flexGrow: 1}}>
                <Typography noWrap>
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                    {artist}
                </Typography>
            </Box>

            {album &&
                <Typography className="album-text-card" color="text.secondary" variant="body2">{album}</Typography>}

            <Typography sx={{textAlign: 'right', margin: '0 5%'}}>
                {duration}
            </Typography>

            <Box>
                <Avatar
                    variant="rounded"
                    src={`http://localhost:8000/${albumImage}`}
                    sx={{width: 45, height: 45, boxShadow: 2}}
                />
            </Box>

            {datetime && isHistory &&
                <Box sx={{marginLeft: '10%'}}>
                    {dayjs(datetime).format('DD.MM.YYYY HH:mm')}
                </Box>
            }
        </Box>
    );
};

export default TrackCard;