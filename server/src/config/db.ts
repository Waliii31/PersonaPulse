import mongoose from 'mongoose';

let mongoMemoryServer: any = null;

export async function connectDB(): Promise<void> {
  const configuredUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/personapulse';

  try {
    // Attempt connection to configured MongoDB URI (fail fast if not running locally)
    await mongoose.connect(configuredUri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`✅ MongoDB connected → ${configuredUri}`);
  } catch (err: any) {
    console.warn(`⚠️  Could not connect to external MongoDB at ${configuredUri} (${err.message})`);
    console.log('🔄 Starting embedded MongoMemoryServer for development / sandbox testing...');

    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create();
      const inMemoryUri = mongoMemoryServer.getUri();

      await mongoose.connect(inMemoryUri);
      console.log(`✅ Embedded MongoMemoryServer connected → ${inMemoryUri}`);
    } catch (memErr) {
      console.error('❌ Failed to start both external MongoDB and embedded MongoMemoryServer:', memErr);
      process.exit(1);
    }
  }

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB runtime error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  MongoDB disconnected');
  });
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
}
