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
    },
    track_number: {
        type: Number
    },
    isPublished: {
        type: Boolean,
        required: true,
        default: false
    }
});

trackSchema.pre('save', async function () {
    if (!this.isNew || this.track_number) {
        return;
    }

    const lastTrack = await Track.findOne({album: this.album}).sort('-track_number');

    if (lastTrack && lastTrack.track_number) {
        this.track_number = lastTrack.track_number + 1;
    } else {
        this.track_number = 1;
    }
})

const Track = mongoose.model('Track', trackSchema);
export default Track;