import mongoose from "mongoose";

export async function dbConnect() {
    try {
        mongoose.connect(process.env.NEXT_PUBLIC_MONGO_URL?? "");
        const connection = mongoose.connection;
        return connection;
    } catch (error) {
        console.error("Database connection error:", error);
        throw new Error("Failed to connect to the database");
    }
}