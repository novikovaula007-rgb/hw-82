import express from "express";
import User from "../models/User";
import {Error} from "mongoose";

export const usersRouter = express.Router();

usersRouter.post('/', async (req, res, next) => {
    try {
        const user = new User({
            username: req.body.username,
            password: req.body.password
        });

        await user.save();
        return res.send(user);
    } catch (e) {
        if (e instanceof Error.ValidationError) {
            return res.status(400).send(e);
        }

        return next(e);
    }
})