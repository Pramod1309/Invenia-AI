import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const options = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      maxPoolSize: 10, // Maintain up to 10 socket connections
    };
    
    await mongoose.connect(process.env.MONGO_URI, options);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    console.log("Continuing without database connection...");
    // Don't exit process, allow server to run without DB for development
  }
};

export default connectDB;
