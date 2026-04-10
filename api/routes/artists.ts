import express from "express";
import Artist from "../models/Artist";
import {imagesUpload} from "../multer";
import {IArtist} from "../types";
import Album from "../models/Album";
import auth, {RequestWithUser} from "../middleware/auth";
import Track from "../models/Track";
import permit from "../middleware/permit";
import optionalAuth from "../middleware/optionalAuth";

const artistsRouter = express.Router();

artistsRouter.get('/', optionalAuth, async (req, res, next) => {
    try {
        const {user} = req as RequestWithUser;

        let filter: Record<string, unknown> = {};

        if (!user || user.role !== 'admin') {
            filter = {
                $or: [
                    {isPublished: true},
                    ...(user ? [{user: user._id}] : [])
                ]
            };
        }

        const artists = await Artist.find(filter);
        res.send(artists);
    } catch (e) {
        next(e);
    }
});

artistsRouter.get('/:artist_id', optionalAuth, async (req, res, next) => {
    try {
        const {artist_id} = req.params;
        const {user} = req as RequestWithUser;

        let filter: Record<string, unknown> = {_id: artist_id};

        if (!user || user.role !== 'admin') {
            filter = {
                _id: artist_id,
                $or: [
                    {isPublished: true},
                    ...(user ? [{user: user._id}] : [])
                ]
            };
        }

        const artist = await Artist.findOne(filter);
        res.send(artist);
    } catch (e) {
        next(e);
    }
});

artistsRouter.post('/', auth, imagesUpload.single('photo'), async (req, res, next) => {
    const {user} = req as RequestWithUser;

    try {
        if (user) {
            const newArtist: IArtist = {
                name: req.body.name,
                description: req.body.description,
                photo: req.file ? 'images/' + req.file.filename : null,
                user: user._id.toString()
            };

            const artist = new Artist(newArtist);
            await artist.save();
            return res.send({
                message: 'The artist has been successfully created. Please wait for it to be published',
                artist
            });
        }
    } catch (e) {
        next(e);
    }
});

artistsRouter.delete('/:artist_id', auth, async (req, res, next) => {
    const {user} = req as RequestWithUser;
    const {artist_id} = req.params;

    try {
        if (user) {
            const artist = await Artist.findById(artist_id);

            if (!artist) {
                return res.status(404).send({error: 'Artist not found'});
            }

            if ((user.role === 'admin') || (user.role === 'user' && artist.user.toString() === user._id.toString() && !artist.isPublished)) {
                const albums = await Album.find({artist: artist_id as string});
                const albumIDArray = albums.map(album => album._id);

                await Track.deleteMany({album: {$in: albumIDArray}});
                await Album.deleteMany({artist: artist_id as string});
                await Artist.findByIdAndDelete(artist_id);
                return res.send({message: 'Artist and related albums & tracks were successfully deleted'});
            }

            if (user.role === 'user' && artist.user.toString() !== user._id.toString()) {
                return res.status(403).send({message: 'You are not allowed to delete this artist'});
            }
        }
    } catch (e) {
        next(e);
    }
});

artistsRouter.patch('/:id/togglePublished', auth, permit('admin'), async (req, res, next) => {
    const {user} = req as RequestWithUser;
    const {id} = req.params;

    try {
        if (user) {
            const artist = await Artist.findById(id);

            if (!artist) {
                return res.status(404).send({error: 'Artist not found'});
            }

            artist.isPublished = !artist.isPublished;
            await artist.save();

            if (!artist.isPublished) {
                const albums = await Album.find({artist: artist._id});
                const albumIDArray = albums.map(a => a._id);

                await Album.updateMany({artist: artist._id}, {isPublished: false});
                await Track.updateMany({album: {$in: albumIDArray}}, {isPublished: false});
            }

            return res.send({
                message: `Artist status changed to ${artist.isPublished ? 'published' : 'unpublished'}`,
                artist,
            });
        }
    } catch (e) {
        next(e);
    }
});

export default artistsRouter;