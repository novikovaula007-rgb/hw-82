import express from "express";
import User from "../models/User";
import {Error, HydratedDocument} from "mongoose";
import auth, {RequestWithUser} from "../middleware/auth";
import {IUserFields} from "../types";
import config from "../config";
import {OAuth2Client} from "google-auth-library";
import {imagesUpload} from "../multer";

export const usersRouter = express.Router();

usersRouter.post('/', imagesUpload.single('avatar'),async (req, res, next) => {
    try {
        const user = new User({
            username: req.body.username,
            password: req.body.password,
            displayName: req.body.displayName,
            avatar: req.file ? 'images/' + req.file.filename : null,
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

usersRouter.post('/google', async (req, res, next) => {
    try {
        if (!req.body.credential) return res.status(400).send({error: 'Credential is required.'});
        const client = new OAuth2Client(config.clientID);

        const ticket = await client.verifyIdToken({
            idToken: req.body.credential,
            audience: config.clientID,
        });

        const payload = ticket.getPayload();

        if (!payload) return res.status(400).send({error: 'Google login error.'});

        const email = payload.email;
        const id = payload.sub;
        const displayName = payload.name;
        const avatar = payload.picture;

        if (!email) return res.status(400).send({error: 'Not enough information from Google.'})

        let user = await User.findOne({googleID: id});

        if (!user) {
            const generatePassword = crypto.randomUUID();

            user = new User({
                username: email,
                password: generatePassword,
                googleID: id,
                displayName,
                avatar: avatar
            });
        }

        user.generateAuthToken();

        const userSave = await user.save();
        res.cookie('token', userSave.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        res.send({message: 'Logged in with Google successfully.', user});
    } catch (e) {
        next(e);
    }
});