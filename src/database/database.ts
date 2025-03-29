import mongoose from 'mongoose'

let isConnected = 0

export async function dbConnect(): Promise<void> {
  if (isConnected === 1) {
    return
  }
  if (!process.env.MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable in your .env file')
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI)
    isConnected = db.connection.readyState
    console.log('MongoDB is connected:', isConnected === 1)
  } catch (error) {
    console.error('MongoDB connection error:', error)
    throw error
  }
}
