import express from "express";
import User from "../models/User";
import {Error, HydratedDocument} from "mongoose";
import auth, {RequestWithUser} from "../middleware/auth";
import {IUserFields} from "../types";

export const usersRouter = express.Router();

usersRouter.post('/', async (req, res, next) => {
    try {
        const user = new User({
            username: req.body.username,
            password: req.body.password,
            display_name: req.body.display_name,
            phone_number: req.body.phone_number,
        });

        user.generateAuthToken();

        const saveUser = await user.save();

        res.cookie('token', saveUser.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        res.send({message: 'User registered successfully.', user});
    } catch (e) {
        if (e instanceof Error.ValidationError) {
            return res.status(400).send(e);
        }
        next(e);
    }
});

usersRouter.post('/sessions', async (req, res, next) => {
    try {
        const user = await User.findOne({username: req.body.username});

        if (!user) {
            return res.status(400).send({error: 'Username not found.'});
        }

        const isMatch = await user.checkPassword(req.body.password);

        if (!isMatch) {
            return res.status(400).send({error: 'Invalid password.'});
        }

        user.generateAuthToken();

        const userSave = await user.save();

        res.cookie('token', userSave.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        res.send({message: 'Logged in successfully.', user});
    } catch (e) {
        next(e);
    }
});


usersRouter.delete('/sessions', auth, async (req, res) => {
    const {user} = req as RequestWithUser;

    if (user) {
        user.token = '';
        await (user as HydratedDocument<IUserFields>).save();
    }

    res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'strict',
    });

    res.send({message: 'Logged out successfully.'});
});