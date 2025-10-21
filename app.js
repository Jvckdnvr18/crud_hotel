const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Load environment variables immediately
dotenv.config();

// Define PORT before use
const PORT = process.env.PORT || 3000;

// Database connection function (Assuming db.js exports a function using module.exports)
// Changed from import() to require() and using a relative path
const connectDB = require('./config/db.js');

// Route files
// CRITICAL FIX: Changed from import() to synchronous require()
const roomRoutes = require('./routes/room.js');
const guestRoutes = require('./routes/guest.js');
const bookingRoutes = require('./routes/booking.js');

const app = express();

// Connect to MongoDB
connectDB().catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.json());
// Note: express.json() is now sufficient and modern, but keeping bodyParser for compatibility.
app.use(bodyParser.json());

// Root route
app.get('/', async (req, res) => {
    try {
        // Quick DB check
        if (mongoose.connection.readyState !== 1) {
            await connectDB();
        }
        res.send('<h1>🏨 Hotel Management API is running!</h1><p>Access endpoints at /api/rooms, /api/guests, and /api/bookings</p>');
    } catch (error) {
        res.status(500).send('Database connection error. Please try again.');
    }
});

// Mount routers (This is line 26, now using the actual router function)
app.use('/api/rooms', roomRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/bookings', bookingRoutes);

if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`🚀 Local Server running on http://localhost:${PORT}`);
    });
}

// 3. CRITICAL VERCEL EXPORT: Export the application handler
module.exports = app;
