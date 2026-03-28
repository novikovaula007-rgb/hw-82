import mongoose, {Document, Model} from "mongoose";
import {IUserFields} from "../types";
import bcrypt from "bcrypt";
import {randomUUID} from "crypto";

const SALT_WORK_FACTOR = 10;

interface UserMethods {
    checkPassword(password: string): Promise<boolean>,

    generateToken(): void
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

    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.set('toJSON', {
    transform: (_doc, ret, _options) => {
        const {password, ...rest} = ret;
        return rest;
    }
});

userSchema.methods.checkPassword = function (password: string) {
    return bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = function () {
    this.token = randomUUID();
};

const User = mongoose.model<IUserFields, UserModel>('User', userSchema);

export default User;