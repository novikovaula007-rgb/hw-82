import mongoose from "mongoose";
import {IUserFields} from "../types";

const userSchema = new mongoose.Schema<IUserFields>({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

const User = mongoose.model('User', userSchema);

export default User;