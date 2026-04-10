import express from "express";
import Album from "../models/Album";
import {IAlbum} from "../types";
import {imagesUpload} from "../multer";
import Artist from "../models/Artist";
import auth, {RequestWithUser} from "../middleware/auth";
import Track from "../models/Track";
import permit from "../middleware/permit";
import optionalAuth from "../middleware/optionalAuth";

const albumsRouter = express.Router();

albumsRouter.get('/', optionalAuth, async (req, res, next) => {
    try {
        const {artist} = req.query;
        const {user} = req as RequestWithUser;

        let filter: Record<string, unknown> = artist ? {artist} : {};

        if (!user || user.role !== 'admin') {
            filter = {
                ...filter,
                $or: [
                    {isPublished: true},
                    ...(user ? [{user: user._id}] : [])
                ]
            };
        }

        const albums = await Album.find(filter)
            .populate('artist')
            .sort({year: -1});
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
            return res.send({
                message: 'The album has been successfully created. Please wait for it to be published',
                album
            });
        }
    } catch (e) {
        next(e);
    }
});

albumsRouter.get('/:album_id', optionalAuth, async (req, res, next) => {
    try {
        const {album_id} = req.params;
        const {user} = req as RequestWithUser;

        let filter: Record<string, unknown> = {_id: album_id};

        if (!user || user.role !== 'admin') {
            filter = {
                _id: album_id,
                $or: [
                    {isPublished: true},
                    ...(user ? [{user: user._id}] : [])
                ]
            };
        }

        const album = await Album.findOne(filter).populate('artist');
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