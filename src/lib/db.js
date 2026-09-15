import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (!MONGO_URI) throw new Error("Please define MONGO_URI");
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, {
      bufferCommands: false,
      dbName: "aktivpal",
      serverSelectionTimeoutMS: 5000,
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    // A temporary outage must not poison every later request until restart.
    cached.promise = null;
    throw error;
  }
}
