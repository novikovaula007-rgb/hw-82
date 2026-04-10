import "../TrackStyles.css";
import {Avatar, Box, Button, IconButton, Typography} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import * as React from "react";
import dayjs from "dayjs";
import {useAppDispatch, useAppSelector} from "../../../app/hooks.ts";
import {addNewEntry} from "../../trackHistory/store/trackHistorySlice.ts";
import {selectUser} from "../../users/store/usersSlice.ts";
import {toast} from "react-toastify";
import CardOverlay from "../../../components/UI/CardOverlay/CardOverlay.tsx";
import {useState} from "react";
import {fetchTracks, toggleTrackPublished} from "../store/tracksSlice.ts";

interface Props {
    id: string,
    artist: string,
    title: string,
    duration: string,
    albumImage?: string | null,
    track_number?: number,
    albumID?: string,
    album?: string,
    isHistory?: boolean,
    datetime?: Date,
    isPublished: boolean,
}

const TrackCard: React.FC<Props> = ({id, artist, title, albumID, isPublished, duration, track_number, album, isHistory = false, datetime, albumImage}) => {
    const dispatch = useAppDispatch();
    const [toggleLoading, setToggleLoading] = useState<boolean>(false);
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
    };

    const handleToggle = async () => {
        try {
            setToggleLoading(true);
            if (albumID) {
                await dispatch(toggleTrackPublished({trackID: id, albumID}));
                await dispatch(fetchTracks(albumID))
            }
        } catch (e) {
            console.log(e);
        } finally {
            setToggleLoading(false);
        }
    };

    return (
        <Box className="track-card-wrapper">
            {!isPublished && (<CardOverlay/>)}

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
                    {artist} <span style={{color: 'purple', fontWeight: 'bold'}}>{!isPublished && 'Not published'}</span>
                </Typography>
            </Box>

            {album &&
                <Typography className="album-text-card" color="text.secondary" variant="body2">{album}</Typography>}

            {user?.role === 'admin'  && (
                <Button
                    color="secondary"
                    variant="contained"
                    onClick={handleToggle}
                    loading={toggleLoading}
                    disabled={toggleLoading}
                    sx={{
                        zIndex: 2,
                        borderRadius: '10px',
                        fontSize: '10px',
                        padding: '5px 10px',
                        margin: '0 10px',
                        fontWeight: 'bold',
                        borderColor: 'secondary.main',
                    }}
                >
                    {isPublished ? 'Suppress' : 'Publish'}
                </Button>
            )}

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