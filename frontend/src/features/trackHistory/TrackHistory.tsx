import {useEffect} from 'react';
import {Box, Typography} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import Spinner from "../../components/UI/Spinner/Spinner";
import {fetchTrackHistory, selectTrackHistory, selectTrackHistoryLoading} from "./store/trackHistorySlice.ts";
import TrackCard from "../tracks/components/TrackCard.tsx";
import "./TrackHistoryStyles.css";

const TrackHistory = () => {
    const dispatch = useAppDispatch();
    const tracks = useAppSelector(selectTrackHistory);
    const tracksLoading = useAppSelector(selectTrackHistoryLoading).loadingAllTracks;

    useEffect(() => {
        dispatch(fetchTrackHistory());
        console.log(tracks)
    }, [dispatch]);

    return (
        <Box>
            <Typography sx={{marginBottom: '15px'}} variant='h4'>Track history</Typography>
            {tracksLoading && <Spinner/>}
            {!tracksLoading && tracks.length === 0 && 'No tracks yet.'}
            {!tracksLoading && tracks.length > 0 && (
                <Box className='track-history-list'>{tracks.map(track => {
                    return <TrackCard key={track._id}
                                      id={track._id}
                                      artist={track.artistName}
                                      title={track.trackName}
                                      duration={track.trackDuration}
                                      album={track.albumTitle}
                                      datetime={track.datetime}
                                      albumImage={track.albumImage}
                                      isHistory
                    />
                })}</Box>
            )}
        </Box>
    );
};

export default TrackHistory;