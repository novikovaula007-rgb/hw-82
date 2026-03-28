import {NextFunction, Request, RequestHandler, Response} from 'express';
import {Types} from 'mongoose';
import {IUserFields} from '../types';
import User from '../models/User';

export interface RequestWithUser extends Request {
    user?: IUserFields & { _id: Types.ObjectId };
}

const auth: RequestHandler = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const token = req.get('Authorization');

    if (!token) {
        return res.status(401).send({error: 'Token not provided!'});
    }

    const user = await User.findOne({token});

    if (!user) {
        return res.status(401).send({error: 'No such user!'});
    }

    req.user = user;
    next();
};

export default auth;