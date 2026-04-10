import {Box, Button, Divider, Typography} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {
    clearAlbums,
    fetchAlbums,
    selectAlbums,
    selectAlbumsLoading,
} from "./store/albumsSlice.ts";
import {useEffect, useState} from "react";
import "./AlbumStyles.css"
import {useNavigate, useParams} from "react-router";
import Spinner from "../../components/UI/Spinner/Spinner.tsx";
import AlbumCard from "./components/AlbumCard.tsx";
import {
    clearSelectedArtist,
    fetchSelectedArtist,
    selectArtistsLoading,
    selectSelectedArtist, toggleArtistPublished
} from "../artists/store/artistsSlice.ts";
import {selectUser} from "../users/store/usersSlice.ts";

const ArtistAlbums = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const albums = useAppSelector(selectAlbums);
    const albumsLoading = useAppSelector(selectAlbumsLoading).loadingAllAlbums;
    const artistLoading = useAppSelector(selectArtistsLoading).loadingAllArtists;
    const selectedArtist = useAppSelector(selectSelectedArtist);
    const [toggleLoading, setToggleLoading] = useState<boolean>(false);

    const {artistId} = useParams();
    const navigate = useNavigate();

    const handleToggle = async () => {
        try {
            setToggleLoading(true);
            if (selectedArtist && artistId) {
                await dispatch(toggleArtistPublished(selectedArtist._id));
                await dispatch(fetchSelectedArtist(artistId)).unwrap();
                await dispatch(fetchAlbums(artistId)).unwrap();
            }
        } catch (e) {
            console.log(e);
        } finally {
            setToggleLoading(false);
        }
    };


    useEffect(() => {
        const fetchData = async () => {
            if (artistId) {
                try {
                    await dispatch(fetchAlbums(artistId)).unwrap();
                    await dispatch(fetchSelectedArtist(artistId)).unwrap();
                } catch (e) {
                    navigate('/not-found');
                }
            }
        }

        fetchData();

        return () => {
            dispatch(clearSelectedArtist());
            dispatch(clearAlbums());
        };
    }, [dispatch, artistId]);

    return (
        <Box className='album-container'>
            <Box>
                <Typography sx={{marginBottom: '15px'}} variant='h4'>About artist</Typography>
                {artistLoading && <Spinner/>}
                {!artistLoading && selectedArtist && (
                    <Box>
                        <Typography sx={{fontSize: '25px'}}>{selectedArtist.name}</Typography>
                        <Typography sx={{color: '#8a8a8a'}}>{selectedArtist.description}</Typography>
                    </Box>
                )}
                {selectedArtist && user?.role === 'admin' && (
                    <>
                        <Divider sx={{margin: '20px 0'}}/>
                        <Button type="submit" variant="contained"
                                onClick={handleToggle}
                                loading={toggleLoading}
                                disabled={toggleLoading}
                                sx={{backgroundColor: "secondary.main", mb: '20px'}}>
                            {selectedArtist.isPublished ? 'Suppress' : 'Publish'}
                        </Button>
                    </>
                )}
            </Box>
            <Box>
                <Typography sx={{marginBottom: '15px'}} variant='h4'>Albums</Typography>
                {albumsLoading && <Spinner/>}
                {!albumsLoading && albums.length === 0 && 'No albums yet.'}
                {!albumsLoading && albums.length > 0 && (
                    <Box className='albums-list'>
                        {albums.map(album => {
                            return <AlbumCard key={album._id}
                                              image={album.image}
                                              title={album.title}
                                              id={album._id}
                                              release_year={album.release_year}
                                              isPublished={album.isPublished}/>
                        })}
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default ArtistAlbums;