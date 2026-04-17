import {Request, Response, NextFunction, RequestHandler} from "express";
import {Types} from "mongoose";
import {IUserFields} from "../types";
import User from "../models/User";
import jwt, {TokenExpiredError} from "jsonwebtoken";
import config from "../config";

export interface RequestWithUser extends Request {
    user?: IUserFields & { _id: Types.ObjectId };
}

const auth: RequestHandler = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const JWTToken = req.cookies.token;

        if (!JWTToken) {
            return res.status(401).send({error: 'No token present'});
        }

        const decoded = jwt.verify(JWTToken, config.JWTSecret) as { _id: string };

        const user = await User.findOne({_id: decoded._id, token: JWTToken});

        if (!user) {
            return res.status(401).send({error: 'Invalid token'});
        }

        req.user = user;
        next();
    } catch (e) {
        console.log(e);
        if (e instanceof TokenExpiredError) {
            return res.status(401).send({error: 'Your token expired'});
        } else {
            return res.status(401).send({error: "Please authenticate"});
        }
    }
};

export default auth;