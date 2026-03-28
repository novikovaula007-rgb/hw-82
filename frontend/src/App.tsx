import {Route, Routes } from "react-router";
import Navbar from "../components/Navbar/Navbar.tsx";
import {Container} from "@mui/material";
import NotFoundPage from "../components/NotFoundPage/NotFoundPage.tsx";
import Artists from "../features/artists/Artists.tsx";
import ArtistAlbums from "../features/albums/ArtistAlbums.tsx";
import AlbumTracks from "../features/tracks/AlbumTracks.tsx";
import TrackHistory from "../features/trackHistory/TrackHistory.tsx";

const App = () => {
    return (
        <>
            <Navbar/>
            <Container sx={{marginTop: '25px'}}>
                <Routes>
                    <Route path='/' element={(<Artists/>)}/>
                    <Route path='/track-history' element={(<TrackHistory/>)}/>
                    <Route path='/artist/:artistId' element={(<ArtistAlbums/>)}/>
                    <Route path='/album/:albumId' element={(<AlbumTracks/>)}/>
                    <Route path='*' element={(<NotFoundPage/>)}/>
                </Routes>
            </Container>
        </>
    )
}

export default App
