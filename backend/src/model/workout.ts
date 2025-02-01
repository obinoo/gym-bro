import mongoose from "mongoose";

export const workout = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    durationInMinutes: {
        type: Number,
        required: true,
    },
    exercises: [
        {
            name: {
                type: String,
                required: true,
            },
            description: {
                type: String,
                required: true,
            },
            sets: {
                type: Number,
                required: true,
            },
            reps: {
                type: Number,
                required: true,
            },
            imageURL: {
                type: String,
                required: true,
            },
        }
    ],
    imageURL: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
})




const Workout = mongoose.model('Workout', workout);
export default Workout;