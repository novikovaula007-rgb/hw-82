import {Avatar, Box, Button, Divider, Stack, Typography} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {
    clearSelectedAlbum, deleteAlbum,
    fetchSelectedAlbum,
    selectAlbumsLoading,
    selectSelectedAlbum, toggleAlbumPublished
} from "../albums/store/albumsSlice.ts";
import {useEffect, useState} from "react";
import "./TrackStyles.css";
import {useNavigate, useParams} from "react-router";
import Spinner from "../../components/UI/Spinner/Spinner.tsx";

import {clearTracks, fetchTracks, selectTracks, selectTracksLoading} from "./store/tracksSlice.ts";
import TrackCard from "./components/TrackCard.tsx";
import {selectUser} from "../users/store/usersSlice.ts";

const AlbumTracks = () => {
    const dispatch = useAppDispatch();

    const tracks = useAppSelector(selectTracks);
    const tracksLoading = useAppSelector(selectTracksLoading).loadingAllTracks;
    const albumsLoading = useAppSelector(selectAlbumsLoading).loadingAllAlbums;
    const [toggleLoading, setToggleLoading] = useState<boolean>(false);
    const deleteLoading = useAppSelector(selectAlbumsLoading).deleteLoading;
    const selectedAlbum = useAppSelector(selectSelectedAlbum);
    const user = useAppSelector(selectUser);

    const {albumId} = useParams();
    const navigate = useNavigate();

    const handleToggle = async () => {
        try {
            setToggleLoading(true);
            if (albumId) {
                await dispatch(toggleAlbumPublished(albumId));
                await dispatch(fetchSelectedAlbum(albumId)).unwrap();
                await dispatch(fetchTracks(albumId)).unwrap();
            }
        } catch (e) {
            console.log(e);
        } finally {
            setToggleLoading(false);
        }
    };

    const onDelete = async () => {
        try {
            if (selectedAlbum) {
                const artistId = selectedAlbum.artist._id;
                await dispatch(deleteAlbum(selectedAlbum._id)).unwrap();
                navigate(`/artist/${artistId}`);
            }
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            if (albumId) {
                try {
                    await dispatch(fetchTracks(albumId)).unwrap();
                    await dispatch(fetchSelectedAlbum(albumId)).unwrap();
                } catch (e) {
                    navigate('/not-found');
                }
            }
        }

        fetchData();

        return () => {
            dispatch(clearSelectedAlbum());
            dispatch(clearTracks());
        };
    }, [dispatch, albumId]);

    return (
        <Box className='album-container'>
            <Box>
                <Typography sx={{marginBottom: '15px'}} variant='h4'>About album</Typography>
                {albumsLoading && <Spinner/>}
                {!albumsLoading && selectedAlbum && (
                    <Box>
                        <Avatar src={`http://localhost:8000/${selectedAlbum.image}`} variant="rounded"
                                sx={{width: 200, height: 200, boxShadow: 2, marginBottom: '20px'}}/>
                        <Typography sx={{fontSize: '25px'}}>{selectedAlbum.title}</Typography>
                        <Typography sx={{color: '#8a8a8a'}}>{selectedAlbum.description}</Typography>
                    </Box>
                )}
                {selectedAlbum && user?.role === 'admin' && (
                    <>
                        <Divider sx={{margin: '20px 0'}}/>
                        <Button type="submit" variant="contained"
                                onClick={handleToggle}
                                loading={toggleLoading}
                                disabled={toggleLoading}
                                sx={{backgroundColor: "secondary.main", mb: '20px'}}>
                            {selectedAlbum.isPublished ? 'Suppress' : 'Publish'}
                        </Button>
                    </>
                )}
                {selectedAlbum && (user?.role === 'admin' ||
                        user && user._id.toString() === selectedAlbum.user.toString() && !selectedAlbum.isPublished) &&
                    <Button type="submit" variant="contained"
                            color="error"
                            onClick={onDelete}
                            loading={deleteLoading === selectedAlbum._id}
                            disabled={deleteLoading === selectedAlbum._id}
                            sx={{margin: '0 0 20px 10px'}}>
                        Delete
                    </Button>
                }
            </Box>
            <Box>
                <Typography sx={{marginBottom: '15px'}} variant='h4'>Tracks</Typography>
                {tracksLoading && <Spinner/>}
                {!tracksLoading && tracks.length === 0 && 'No tracks yet.'}
                {!tracksLoading && tracks.length > 0 && selectedAlbum && (
                    <Stack>
                        {tracks.map(track => {
                            return <TrackCard key={track._id}
                                              id={track._id}
                                              artist={selectedAlbum.artist.name}
                                              title={track.title}
                                              albumID={track.album}
                                              duration={track.duration}
                                              track_number={track.track_number}
                                              album={selectedAlbum.title}
                                              isPublished={track.isPublished}
                                              userID={track.user}
                            />
                        })}
                    </Stack>
                )}
            </Box>
        </Box>
    );
};

export default AlbumTracks;