import mongoose from "mongoose";

const connectDB = async () => {
    // 1. Optimization: If already connected, don't connect again
    if (mongoose.connections[0].readyState) {
        return;
    }

    try {
        // 2. Connect to the database
        await mongoose.connect(`${process.env.MONGODB_URI}/hotel-booking-system`);
        console.log("MongoDB Connected Successfully");

    } catch (error) {
        // 3. IF FAIL: Log the error and STOP the app
        console.error("Error connecting to MongoDB:", error.message);
        
        // This 'throw' is crucial. It tells the Webhook "Stop! Don't try to save!"
        throw new Error("Database connection failed"); 
    }
}

export default connectDB;