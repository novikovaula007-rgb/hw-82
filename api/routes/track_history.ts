import express from "express";
import User from "../models/User";
import {Error} from "mongoose";
import trackHistory from "../models/TrackHistory";
import {ITrackHistory} from "../types";

const trackHistoryRouter = express.Router();

trackHistoryRouter.post('/', async (req, res, next) => {
    try {
        const token = req.get('Authorization');

        if (!token) {
            return res.status(401).send({error: 'No token present'});
        }

        const user = await User.findOne({token});

        if (!user) {
            return res.status(401).send({error: 'Wrong token!'});
        }

        const track = req.body.track

        const newEntry: ITrackHistory = {
            user: user.username,
            track: track,
            datetime: new Date()
        }

        const entry = new trackHistory(newEntry);
        await entry.save();
        return res.send(entry);
    } catch (e) {
        if (e instanceof Error.ValidationError) {
            return res.status(400).send(e);
        }

        return next(e);
    }
})

export default trackHistoryRouter;