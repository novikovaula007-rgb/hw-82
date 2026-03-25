import express from "express";
import Artist from "../models/Artist";
import {imagesUpload} from "../multer";
import {IArtist} from "../types";
import Album from "../models/Album";
import albumsRouter from "./albums";

const artistsRouter = express.Router();

artistsRouter.get('/', async (req, res, next) => {
    try {
        const artists = await Artist.find();
        res.send(artists);
    } catch (e) {
        next(e);
    }
});

artistsRouter.get('/:artist_id', async (req, res, next) => {
    const {artist_id} = req.params;
    try {
        const artist = await Artist.findById(artist_id);
        res.send(artist);
    } catch (e) {
        next(e);
    }
});

albumsRouter.get('/:album_id', async (req, res, next) => {
    const {album_id} = req.params;
    try {
        const album = await Album.findById(album_id).populate('artist');
        res.send(album);
    } catch (e) {
        next(e);
    }
});

artistsRouter.post('/', imagesUpload.single('photo'), async (req, res, next) => {
    const newArtist: IArtist = {
        name: req.body.name,
        description: req.body.description,
        photo: req.file ? 'images/' + req.file.filename : null
    };

    try {
        const artist = new Artist(newArtist);
        await artist.save();
        res.send(artist);
    } catch (e) {
        next(e);
    }
});

export default artistsRouter;