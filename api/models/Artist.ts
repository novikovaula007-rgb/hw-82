import mongoose from "mongoose";

const artistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        default: null
    },
    description: {
        type: String,
        default: null
    },
    isPublished: {
        type: Boolean,
        required: true,
        default: false
    }
});

const Artist = mongoose.model('Artist', artistSchema);
export default Artist;