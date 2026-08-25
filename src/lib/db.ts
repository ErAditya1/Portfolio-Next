import mongoose from "mongoose";
import dns from "dns";

// Fix for querySrv ECONNREFUSED on networks/ISPs where local DNS fails to resolve MongoDB Atlas SRV records
try {
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch (e) {
  // Ignore in environments where setServers is restricted
}

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  console.warn("MONGODB_URI is not defined in environment variables.");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose ?? { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * Connect to MongoDB using a cached connection to prevent
 * multiple connections during Next.js hot reloads.
 */
export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn && mongoose.connection.readyState >= 1) return cached.conn;

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is missing in environment variables.");
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // 5s connection timeout
      connectTimeoutMS: 10000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // Reset cache on failure so future requests can retry
    throw e;
  }

  return cached.conn;
}

