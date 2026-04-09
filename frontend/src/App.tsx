import {Route, Routes} from "react-router";
import {Container} from "@mui/material";
import NotFoundPage from "./components/NotFoundPage/NotFoundPage.tsx";
import Artists from "./features/artists/Artists.tsx";
import ArtistAlbums from "./features/albums/ArtistAlbums.tsx";
import AlbumTracks from "./features/tracks/AlbumTracks.tsx";
import TrackHistory from "./features/trackHistory/TrackHistory.tsx";
import Navbar from "./components/Navbar/Navbar.tsx";
import Register from "./features/users/Register.tsx";
import Login from "./features/users/Login.tsx";
import ProtectedRouter from "./components/ProtectedRouter/ProtectedRouter.tsx";
import NewArtist from "./features/artists/NewArtist.tsx";
import NewAlbum from "./features/albums/NewAlbum.tsx";
import NewTrack from "./features/tracks/NewTrack.tsx";

const App = () => {
    return (
        <>
            <Navbar/>
            <Container sx={{marginTop: "25px"}}>
                <Routes>
                    <Route path="/" element={(<Artists/>)}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/tracks/new" element={(<ProtectedRouter><NewTrack/></ProtectedRouter>)}/>
                    <Route path="/albums/new" element={(<ProtectedRouter><NewAlbum/></ProtectedRouter>)}/>
                    <Route path="/artists/new" element={(<ProtectedRouter><NewArtist/></ProtectedRouter>)}/>
                    <Route path="/track-history" element={(<ProtectedRouter><TrackHistory/></ProtectedRouter>)}/>
                    <Route path="/artist/:artistId" element={(<ArtistAlbums/>)}/>
                    <Route path="/album/:albumId" element={(<AlbumTracks/>)}/>
                    <Route path="*" element={(<NotFoundPage/>)}/>
                </Routes>
            </Container>
        </>
    )
}

export default App
