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
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
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
});

trackSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        const remainingTracks = await mongoose.model('Track')
            .find({album: doc.album})
            .sort('track_number');

        for (let i = 0; i < remainingTracks.length; i++) {
            remainingTracks[i].track_number = i + 1;
            await remainingTracks[i].save();
        }
    }
});

const Track = mongoose.model('Track', trackSchema);
export default Track;