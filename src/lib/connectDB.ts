import mongoose from 'mongoose';

const MONGO_URL = process.env.NEXT_PUBLIC_MONGO_URL??"undefined";

if (MONGO_URL == "undefined") {
  throw new Error('Please define the MONGO_URL environment variable in .env (issue in connectDB.ts)');
}
interface GlobalMongoose {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: GlobalMongoose | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    cached!.promise = mongoose.connect(MONGO_URL, {
      dbName: 'BadCigarette'
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    throw e;
  }

  return cached!.conn;
}

export default connectDB;