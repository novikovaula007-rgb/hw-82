import {useEffect} from 'react';
import {Box, Typography} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {fetchArtists, selectArtists, selectArtistsLoading} from "./store/artistsSlice";
import Spinner from "../../components/UI/Spinner/Spinner";
import ArtistCard from "./components/ArtistCard";

const Artists = () => {
    const dispatch = useAppDispatch();
    const artists = useAppSelector(selectArtists);
    const artistsLoading = useAppSelector(selectArtistsLoading).loadingAllArtists;

    useEffect(() => {
        dispatch(fetchArtists());
    }, [dispatch]);

    return (
        <Box>
            <Typography sx={{marginBottom: '15px'}} variant='h4'>Artists</Typography>
            {artistsLoading && <Spinner/>}
            {!artistsLoading && artists.length === 0 && 'No artists yet.'}
            {!artistsLoading && artists.length > 0 && (
                <Box className='artists-list'>{artists.map(artist => {
                    return <ArtistCard key={artist._id} photo={artist.photo} name={artist.name} id={artist._id}/>
                })}</Box>
            )}
        </Box>
    );
};

export default Artists;