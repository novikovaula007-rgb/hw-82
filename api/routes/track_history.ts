import express from "express";
import mongoose, {Error} from "mongoose";
import trackHistory from "../models/TrackHistory";
import {ITrackHistoryPopulated} from "../types";
import auth, {RequestWithUser} from "../middleware/auth";
import Track from "../models/Track";
import TrackHistory from "../models/TrackHistory";

const trackHistoryRouter = express.Router();

trackHistoryRouter.post('/', auth, async (req, res, next) => {
    try {
        const user = (req as RequestWithUser).user;
        const trackID = req.body.track;

        if (!trackID) {
            return res.status(401).send({error: 'No track ID present'})
        }

        if (trackID && !mongoose.Types.ObjectId.isValid(trackID as string)) {
            return res.status(400).send({error: 'Invalid track ID format'});
        }

        const track = await Track.findById(trackID);

        if (!track) {
            return res.status(404).send({error: 'Track not found'});
        }

        if (user) {
            const newEntry = {
                user: user._id,
                track: trackID,
                datetime: new Date()
            }

            const entry = new trackHistory(newEntry);
            await entry.save();
            return res.send({entry, track});
        }
    } catch (e) {
        if (e instanceof Error.ValidationError) {
            return res.status(400).send(e);
        }

        return next(e);
    }
});

trackHistoryRouter.get('/', auth, async (req, res, next) => {
    try {
        const user = (req as RequestWithUser).user;
        if (user) {
            const tracks = await TrackHistory.find({user: user._id})
                .sort({datetime: -1})
                .populate({
                    path: 'track',
                    populate: {
                        path: 'album',
                        select: 'image title',
                        populate: {path: 'artist', select: 'name'}
                    }
                })
                .lean() as unknown as ITrackHistoryPopulated[];

            if (tracks) {
                const trackObjectsArray = tracks.map(item => ({
                    _id: item._id,
                    datetime: item.datetime,
                    trackName: item.track.title,
                    trackDuration: item.track.duration,
                    artistName: item.track.album.artist.name,
                    albumImage: item.track.album.image,
                    albumTitle: item.track.album.title
                }));

                return res.send(trackObjectsArray);
            }

        }
    } catch (e) {
        if (e instanceof Error.ValidationError) {
            return res.status(400).send(e);
        }

        return next(e);
    }
})


export default trackHistoryRouter;