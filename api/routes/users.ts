import express from "express";
import User from "../models/User";
import {Error} from "mongoose";
import auth, {RequestWithUser} from "../middleware/auth";

export const usersRouter = express.Router();

usersRouter.post('/', async (req, res, next) => {
    try {
        const user = new User({
            username: req.body.username,
            password: req.body.password
        });

        user.generateToken();

        await user.save();
        return res.send({message: 'User registered successfully', user});
    } catch (e) {
        if (e instanceof Error.ValidationError) {
            return res.status(400).send(e);
        }

        return next(e);
    }
});

usersRouter.post('/sessions', async (req, res) => {
    const user = await User.findOne({username: req.body.username});
    if (!user) {
        return res.status(400).send({error: 'Username not found'});
    }
    const isMatch = await user.checkPassword(req.body.password);
    if (!isMatch) {
        return res.status(400).send({error: 'Password is wrong'});
    }

    user.generateToken();
    await user.save();

    return res.send({message: 'Username and password correct!', user});
});

usersRouter.delete('/sessions', auth, async (req, res, next) => {
    try {
        const {user} = req as RequestWithUser;

        if (user) {
            const {randomUUID} = await import('crypto');
            await User.updateOne({_id: user._id}, {token: randomUUID()});
            return res.send({message: 'Logged out successfully.'});
        }

        return res.status(401).send({error: 'Unauthorized'});
    } catch (e) {
        next(e);
    }
});

