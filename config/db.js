// ...existing code...
const mongoose = require('mongoose');

const connectDB = async () => {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        throw new Error('MONGO_URI environment variable is not set');
    }

    try {
        // Reuse existing connection in serverless environments
        if (mongoose.connection.readyState === 1) {
            return mongoose.connection;
        }

        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            bufferCommands: false, // Disable buffering
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        };

        const conn = await mongoose.connect(uri, options);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
        // Handle connection errors
        mongoose.connection.on('error', err => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

        return conn;
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        throw error;
    }
};

module.exports = connectDB;

    return global._mongoosePromise;
};

module.exports = connectDB;
// ...existing code...