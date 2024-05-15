import mongoose from "mongoose";
import { bookingSchema } from "./bookingModel.js";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    bookings: [bookingSchema]
});

export const User = mongoose.model('User', userSchema);