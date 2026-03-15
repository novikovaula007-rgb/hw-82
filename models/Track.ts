import mongoose, {Schema} from "mongoose";

const trackSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    album: {
        type: Schema.Types.ObjectId,
        ref: 'Album',
        required: true
    },
    duration: {
        type: String,
        required: true
    }
});

const Track = mongoose.model('Track', trackSchema);
export default Track;