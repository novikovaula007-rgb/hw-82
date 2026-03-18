import mongoose, {Model} from "mongoose";
import {IUserFields} from "../types";
import bcrypt from "bcrypt";

const SALT_WORK_FACTOR = 10;

interface UserMethods {
    checkPassword(password: string): Promise<boolean>;
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
    }
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

userSchema.methods.checkPassword = function(password: string) {
    return bcrypt.compare(password, this.password);
};

const User = mongoose.model<IUserFields, UserModel>('User', userSchema);

export default User;