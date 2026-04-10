import {NextFunction, Response} from 'express';
import User from '../models/User';
import {RequestWithUser} from "./auth";

const optionalAuth = async (req: RequestWithUser, _res: Response, next: NextFunction) => {
    const token = req.get('Authorization');

    if (!token) {
        return next();
    }

    const user = await User.findOne({token});

    if (user) {
        req.user = user;
    }

    next();
};

export default optionalAuth;