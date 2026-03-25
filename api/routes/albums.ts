import express from "express";
import Album from "../models/Album";
import {IAlbum} from "../types";
import {imagesUpload} from "../multer";
import Artist from "../models/Artist";
import mongoose from "mongoose";

const albumsRouter = express.Router();

albumsRouter.get('/', async (req, res, next) => {
    const artist = req.query.artist;

    if (artist && !mongoose.Types.ObjectId.isValid(artist as string)) {
        return res.status(400).send({error: 'Invalid artist ID format'});
    }

    const artistExists = await Artist.findById(artist);

    if (!artistExists) {
        return res.status(404).send({error: 'Artist not found'});
    }
    try {
        const filter = artist ? {artist: artist} : {};
        const albums = await Album.find(filter).populate('artist').sort({year: -1});
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
        const artistExists = await Artist.findById(req.body.artist);

        if (!artistExists) {
            return res.status(404).send({error: 'Artist not found'});
        }

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