import express from "express";
import Album from "../models/Album";
import {IAlbum} from "../types";
import {imagesUpload} from "../multer";

const albumsRouter = express.Router();

albumsRouter.get('/', async (req, res, next) => {
    const artist = req.query.artist;
    try {
        const filter = artist ? {artist: artist} : {};
        const albums = await Album.find(filter).populate('artist');
        res.send(albums);
    } catch (e) {
        next(e);
    }
});

albumsRouter.post('/', imagesUpload.single('image'), async (req, res, next) => {
    const newAlbum: IAlbum = {
        title: req.body.title,
        artist: req.body.artist,
        description: req.body.description || null,
        release_year: req.body.release_year,
        image: req.file ? 'images/' + req.file.filename : null
    }

    try {
        const album = new Album(newAlbum);
        await album.save();
        res.send(album);
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

export default albumsRouter;