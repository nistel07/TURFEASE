import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: "grounds_booking",
        });
        console.log("Database connected successfully");
    } catch (error) {
        console.log('Error connecting DB', error);
    }
}

export default connectDB;