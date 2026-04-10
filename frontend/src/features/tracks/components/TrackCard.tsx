import "../TrackStyles.css";
import DeleteIcon from '@mui/icons-material/Delete';
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
import {deleteTrack, fetchTracks, selectTracksLoading, toggleTrackPublished} from "../store/tracksSlice.ts";
import Spinner from "../../../components/UI/Spinner/Spinner.tsx";

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
    userID: string,
}

const TrackCard: React.FC<Props> = ({
                                        id,
                                        artist,
                                        title,
                                        albumID,
                                        isPublished,
                                        duration,
                                        track_number,
                                        album,
                                        userID,
                                        isHistory = false,
                                        datetime,
                                        albumImage
                                    }) => {
    const dispatch = useAppDispatch();
    const [toggleLoading, setToggleLoading] = useState<boolean>(false);
    const user = useAppSelector(selectUser);
    const deleteLoading = useAppSelector(selectTracksLoading).deleteLoading;

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

    const onDelete = async () => {
        try {
            await dispatch(deleteTrack(id)).unwrap();
            if (albumID) await dispatch(fetchTracks(albumID));
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <Box className="track-card-wrapper">
            {!isPublished && !isHistory && (<CardOverlay/>)}

            {track_number &&
                <Box color="text.secondary">
                    <Typography sx={{fontSize: '15px'}}>
                        {track_number}
                    </Typography>
                </Box>
            }
            {!isHistory && <IconButton onClick={() => toListenTrack()} disabled={deleteLoading === id}>
                <PlayArrowIcon sx={{height: 38, width: 38}}/>
            </IconButton>}

            <Box sx={{flexGrow: 1}}>
                <Typography noWrap>
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                    {artist} {!isHistory && <span
                    style={{color: 'purple', fontWeight: 'bold'}}>{!isPublished && 'Not published'}</span>}
                </Typography>
            </Box>

            {album &&
                <Typography className="album-text-card" color="text.secondary" variant="body2">{album}</Typography>}

            {user?.role === 'admin' && !isHistory && (
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

            <Typography sx={{textAlign: 'right', margin: '0 3%'}}>
                {duration}
            </Typography>

            {isHistory &&
                <Box>
                    <Avatar
                        variant="rounded"
                        src={`http://localhost:8000/${albumImage}`}
                        sx={{width: 45, height: 45, boxShadow: 2}}
                    />
                </Box>
            }

            {datetime && isHistory &&
                <Box sx={{marginLeft: '5%'}}>
                    {dayjs(datetime).format('DD.MM.YYYY HH:mm')}
                </Box>
            }

            {!isHistory && (user?.role === 'admin' ||
                    user && user._id.toString() === userID && !isPublished) &&
                <IconButton
                    onClick={onDelete}
                    disabled={deleteLoading === id}
                    color="error"
                    sx={{zIndex: '2'}}
                >
                    {deleteLoading === id ? (
                        <Spinner/>
                    ) : (
                        <DeleteIcon/>
                    )}
                </IconButton>
            }
        </Box>
    );
};

export default TrackCard;