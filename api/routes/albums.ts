import express from "express";
import Album from "../models/Album";
import {IAlbum} from "../types";
import {imagesUpload} from "../multer";
import Artist from "../models/Artist";
import mongoose from "mongoose";
import auth, {RequestWithUser} from "../middleware/auth";
import Track from "../models/Track";
import permit from "../middleware/permit";

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

albumsRouter.post('/', auth, imagesUpload.single('image'), async (req, res, next) => {
    const {user} = req as RequestWithUser;

    try {
        if (user) {
            const newAlbum: IAlbum = {
                title: req.body.title,
                artist: req.body.artist,
                description: req.body.description || null,
                release_year: req.body.release_year,
                image: req.file ? 'images/' + req.file.filename : null,
                user: user._id.toString()
            };

            const artistExists = await Artist.findById(req.body.artist);

            if (!artistExists) {
                return res.status(404).send({error: 'Artist not found'});
            }

            const album = new Album(newAlbum);
            await album.save();
            res.send(album);
        }
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

albumsRouter.delete('/:album_id', auth, async (req, res, next) => {
    const {user} = req as RequestWithUser;
    const {album_id} = req.params;

    try {
        if (user) {
            const album = await Album.findById(album_id);

            if (!album) {
                return res.status(404).send({error: 'Album not found'});
            }

            if ((user.role === 'admin') || (user.role === 'user' && album.user.toString() === user._id.toString() && !album.isPublished)) {
                await Track.deleteMany({album: album_id as string});
                await Album.findByIdAndDelete(album_id);
                return res.send({message: 'Album and related tracks were successfully deleted'});
            }

            if (user.role === 'user' && album.user.toString() !== user._id.toString()) {
                return res.status(403).send({message: 'You are not allowed to delete this album'});
            }
        }
    } catch (e) {
        next(e)
    }
});

albumsRouter.patch('/:id/togglePublished', auth, permit('admin'), async (req, res, next) => {
    const {user} = req as RequestWithUser;
    const {id} = req.params;

    try {
        if (user) {
            const album = await Album.findById(id);

            if (!album) {
                return res.status(404).send({error: 'Album not found'});
            }

            if (!album.isPublished) {
                const artist = await Artist.findById(album.artist);

                if (!artist || !artist.isPublished) {
                    return res.status(400).send({
                        error: 'Cannot publish album: the parent artist is not published yet'
                    });
                }
            }

            album.isPublished = !album.isPublished;
            await album.save();

            if (!album.isPublished) {
                await Track.updateMany({album: album._id}, {isPublished: false});
            }

            return res.send({
                message: `Album status changed to ${album.isPublished ? 'published' : 'unpublished'}`,
                album,
            });
        }
    } catch (e) {
        next(e);
    }
});

export default albumsRouter;