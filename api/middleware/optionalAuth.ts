import {NextFunction, Response} from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import {RequestWithUser} from "./auth";
import config from '../config';

const optionalAuth = async (req: RequestWithUser, _res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (!token) {
        return next();
    }

    try {
        const payload = jwt.verify(token, config.JWTSecret) as { _id: string };
        const user = await User.findById(payload._id);

        if (user) {
            req.user = user;
        }

        next()
    } catch (e) {
        next();
    }
};

export default optionalAuth;