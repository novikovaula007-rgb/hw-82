import mongoose, {Document, Model} from "mongoose";
import {IUserFields} from "../types";
import jwt from "jsonwebtoken";
import config from "../config";
import argon2 from "argon2";

interface UserMethods {
    checkPassword: (password: string) => Promise<boolean>;
    generateAuthToken: () => void;
}

type UserModel = Model<IUserFields, {}, UserMethods>;

const userSchema = new mongoose.Schema<IUserFields, UserModel, UserMethods>({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        required: true,
        default: 'user'
    }
});

userSchema.path('username').validate({
    validator: async function (this: Document, value: string) {
        if (!this.isModified('username')) return true;

        const user = await User.findOne({username: value});
        return !user;
    },
    message: 'Username already exists. Please choose another one.'
});

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    try {
        this.password = await argon2.hash(this.password, {
            type: argon2.argon2id,
            memoryCost: 2 ** 16,
            timeCost: 3,
        });
    } catch (e) {
        throw new Error('Error hashing password.');
    }
});

userSchema.set('toJSON', {
    transform: (_doc, ret, _options) => {
        const {password, token, ...rest} = ret;
        return rest;
    }
});

userSchema.methods.checkPassword = function (password: string) {
    return argon2.verify(this.password, password);
};

userSchema.methods.generateAuthToken = function () {
    this.token = jwt.sign({_id: this._id}, config.JWTSecret, {expiresIn: '30d'});
};

const User = mongoose.model<IUserFields, UserModel>('User', userSchema);

export default User;