const mongoose = require('mongoose');

// setting options
const options = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true
  // reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  // reconnectInterval: 5000, // Reconnect every 5000ms
  // poolSize: 10 // Maintain up to 10 socket connections
  // bufferMaxEntries: 0, // If not connected, return errors immediately rather than waiting for reconnect
  // connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  // socketTimeoutMS: 45000 // Close sockets after 45 seconds of inactivity
};

// connect
const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_ATLAS, options);
    console.log(`Connected to MongoDB: ${connection.connection.host}`.cyan.bold);
  } catch {
    console.log(`Failed to connect to MongoDB`.red.bold);
  }
};

module.exports = connectDB;
