import {Avatar, Box, Stack, Typography} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {
    clearSelectedAlbum,
    fetchSelectedAlbum,
    selectAlbumsLoading,
    selectSelectedAlbum
} from "../albums/store/AlbumsSlice.ts";
import {useEffect} from "react";
import "./TrackStyles.css";
import {useNavigate, useParams} from "react-router";
import Spinner from "../../components/UI/Spinner/Spinner.tsx";

import {clearTracks, fetchTracks, selectTracks, selectTracksLoading} from "./store/tracksSlice.ts";
import TrackCard from "./components/TrackCard.tsx";

const AlbumTracks = () => {
    const dispatch = useAppDispatch();

    const tracks = useAppSelector(selectTracks);
    const tracksLoading = useAppSelector(selectTracksLoading).loadingAllTracks;
    const albumsLoading = useAppSelector(selectAlbumsLoading).loadingAllAlbums;
    const selectedAlbum = useAppSelector(selectSelectedAlbum);

    const {albumId} = useParams();
    const navigate = useNavigate();

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
                        <Avatar src={`http://localhost:8000/${selectedAlbum.image}`} variant="rounded" sx={{width: 200, height: 200, boxShadow: 2, marginBottom: '20px'}}/>
                        <Typography sx={{fontSize: '25px'}}>{selectedAlbum.title}</Typography>
                        <Typography sx={{color: '#8a8a8a'}}>{selectedAlbum.description}</Typography>
                    </Box>
                )}
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
                                              duration={track.duration}
                                              track_number={track.track_number}
                                              album={selectedAlbum.title}
                            />
                        })}
                    </Stack>
                )}
            </Box>
        </Box>
    );
};

export default AlbumTracks;