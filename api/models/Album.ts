import mongoose, {Schema} from "mongoose";

const albumSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    artist: {
        type: Schema.Types.ObjectId,
        ref: 'Artist',
        required: true
    },
    release_year: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        default: null
    },
    image: {
        type: String,
        default: null
    },
    isPublished: {
        type: Boolean,
        required: true,
        default: false
    }
});

const Album = mongoose.model('Album', albumSchema);
export default Album;