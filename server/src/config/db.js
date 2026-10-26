const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      tlsAllowInvalidCertificates: true
    });
    isConnected = true;
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host} / ${conn.connection.name}`);
    return conn;
  } catch (atlasError) {
    console.error(`❌ MongoDB Atlas connection error: ${atlasError.message}`);
    console.warn(
      `💡 Note: Ensure your MongoDB Atlas cluster has '0.0.0.0/0' added under Network Access to allow cloud hosts (Render/Vercel) to connect.`
    );

    // Only attempt local in-memory fallback in local development
    if (process.env.NODE_ENV !== 'production') {
      try {
        console.log('🚀 Attempting local in-memory MongoDB fallback...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        const localUri = mongod.getUri();
        const localConn = await mongoose.connect(localUri);
        console.log(`✅ Local In-Memory MongoDB Connected at ${localUri}`);
        return localConn;
      } catch (localError) {
        console.warn('Local fallback not available:', localError.message);
      }
    }
  }
};

module.exports = connectDB;
