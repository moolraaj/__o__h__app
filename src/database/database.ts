import mongoose from "mongoose";

export async function dbConnect(): Promise<void> {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  if (!process.env.MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable in your .env file');
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
    });
    console.log('MongoDB is connected:', db.connection.readyState === 1);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}
