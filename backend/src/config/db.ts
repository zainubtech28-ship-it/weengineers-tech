import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/weengineers';

  if (!process.env.MONGODB_URI && process.env.NODE_ENV === 'production') {
    console.warn('[MongoDB Warning] MONGODB_URI is not defined in production environment variables! Defaulting to local fallback.');
  }

  // Register runtime connection lifecycle events
  mongoose.connection.on('error', (err) => {
    console.error(`[MongoDB Runtime Error] ${err.message || err}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('[MongoDB Warning] Disconnected from database server.');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('[MongoDB] Reconnected to database server.');
  });

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000, // 10 second timeout for initial connection
    });
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}, database: ${conn.connection.name}`);
  } catch (error: any) {
    console.error('[MongoDB Fatal Error] Failed to connect to MongoDB:');
    console.error(`  Details: ${error?.message || error}`);
    console.error('  Troubleshooting: Verify your MONGODB_URI connection string and MongoDB Atlas Network Access IP Whitelist (allow 0.0.0.0/0 for Render).');
    process.exit(1);
  }
};
