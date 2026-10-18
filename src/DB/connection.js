import mongoose from "mongoose";

import dns from "node:dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

export const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => {
            console.log("Connected to MongoDB");
        });
        await mongoose.connect(process.env.DB_URL)

    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }

}