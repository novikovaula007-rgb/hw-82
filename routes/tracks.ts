import express from "express";
import Album from "../models/Album";
import Track from "../models/Track";
import {ITrack} from "../types";

const tracksRouter = express.Router();

tracksRouter.get('/', async (req, res, next) => {
    const album = req.query.album;
    try {
        const filter = album ? {album: album} : {};
        const tracks = await Track.find(filter).populate('album');
        res.send(tracks);
    } catch (e) {
        next(e);
    }
});

tracksRouter.post('/', async (req, res, next) => {
    const newTrack: ITrack = {
        title: req.body.title,
        album: req.body.album,
        duration: req.body.duration
    };

    try {
        const albumExists = await Album.findById(req.body.album);

        if (!albumExists) {
            return res.status(404).send({error: 'Album not found'});
        }

        const track = new Track(newTrack);
        await track.save();
        res.send(track)
    } catch (e) {
        next(e)
    }
})

export default tracksRouter;