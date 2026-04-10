import express from "express";
import Album from "../models/Album";
import Track from "../models/Track";
import {ITrack} from "../types";
import auth, {RequestWithUser} from "../middleware/auth";
import permit from "../middleware/permit";
import optionalAuth from "../middleware/optionalAuth";

const tracksRouter = express.Router();

tracksRouter.get('/', optionalAuth, async (req, res, next) => {
    try {
        const album = req.query.album;
        const {user} = req as RequestWithUser;

        const filter: Record<string, unknown> = {};

        if (!user || user.role !== 'admin') {
            filter.isPublished = true;
        }

        if (album) {
            filter.album = album;
        }
        const tracks = await Track.find(filter).populate('album').sort({track_number: 1});
        res.send(tracks);
    } catch (e) {
        next(e);
    }
});

tracksRouter.get('/:artist_id', optionalAuth, async (req, res, next) => {
    try {
        const {artist_id} = req.params;

        const {user} = req as RequestWithUser;

        const filter: Record<string, unknown> = {artist: artist_id};

        if (!user || user.role !== 'admin') {
            filter.isPublished = true;
        }

        if (artist_id) {
            const albums = await Album.find(filter);
            const albums_ids = albums.map(album => {
                return album._id
            });
            const tracks = await Track.find({
                album: albums_ids,
                isPublished: !user || user.role !== 'admin'
            }).populate('album').sort({track_number: 1});
            return res.send(tracks);
        }
    } catch (e) {
        next(e);
    }
});

tracksRouter.post('/', auth, async (req, res, next) => {
    const {user} = req as RequestWithUser;

    try {
        if (user) {
            const newTrack: ITrack = {
                title: req.body.title,
                album: req.body.album,
                duration: req.body.duration,
                user: user._id.toString()
            };

            const albumExists = await Album.findById(req.body.album);

            if (!albumExists) {
                return res.status(404).send({error: 'Album not found'});
            }

            const track = new Track(newTrack);
            await track.save();
            return res.send({
                message: 'The track has been successfully created. Please wait for it to be published',
                track
            });
        }
    } catch (e) {
        next(e)
    }
});

tracksRouter.delete('/:track_id', auth, async (req, res, next) => {
    const {user} = req as RequestWithUser;
    const {track_id} = req.params;

    try {
        if (user) {
            const track = await Track.findById(track_id);

            if (!track) {
                return res.status(404).send({error: 'Track not found'});
            }

            if ((user.role === 'admin') || (user.role === 'user' && track.user.toString() === user._id.toString() && !track.isPublished)) {
                await Track.findByIdAndDelete(track_id);
                return res.send({message: 'Track was successfully deleted'});
            }

            if (user.role === 'user' && track.user.toString() !== user._id.toString()) {
                return res.status(403).send({message: 'You are not allowed to delete this track'});
            }
        }
    } catch (e) {
        next(e)
    }
});

tracksRouter.patch('/:id/togglePublished', auth, permit('admin'), async (req, res, next) => {
    try {
        const {user} = req as RequestWithUser;
        const {id} = req.params;

        if (user) {
            const track = await Track.findById(id);

            if (!track) {
                return res.status(404).send({error: 'Track not found'});
            }

            if (!track.isPublished) {
                const album = await Album.findById(track.album);

                if (!album || !album.isPublished) {
                    return res.status(400).send({
                        error: 'Cannot publish track: the parent album is not published yet'
                    });
                }
            }

            track.isPublished = !track.isPublished;
            await track.save();

            return res.send({
                message: `Track status changed to ${track.isPublished ? 'published' : 'unpublished'}`,
                track,
            });
        }
    } catch (e) {
        next(e);
    }
});

export default tracksRouter;