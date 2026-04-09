import {RequestWithUser} from "./auth";
import {NextFunction, Request, Response} from "express";

const permit = (...roles: string[]) => {
    return (expressReq: Request, res: Response, next: NextFunction)=> {
        const {user} = expressReq as RequestWithUser;

        if (!user) {
            return res.status(401).send({message: 'Please authenticate'});
        }

        if (!roles.includes(user.role)) {
            return res.status(403).send({message: 'You do not have permission to perform this action'});
        }

        next();
    }
};

export default permit;