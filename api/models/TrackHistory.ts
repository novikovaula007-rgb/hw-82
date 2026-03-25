import mongoose, {Schema} from "mongoose";

const trackHistorySchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    track: {
        type: Schema.Types.ObjectId,
        required: true
    },
    datetime: {
        type: Date,
        required: true
    }
});

const TrackHistory = mongoose.model('TrackHistory', trackHistorySchema);

export default TrackHistory;