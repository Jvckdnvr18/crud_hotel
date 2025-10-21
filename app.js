const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

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

// Middleware
app.use(express.json());
// Note: express.json() is now sufficient and modern, but keeping bodyParser for compatibility.
app.use(bodyParser.json());

// Root route
app.get('/', (req, res) => {
    res.send('<h1>🏨 Hotel Management API is running!</h1><p>Access endpoints at /api/rooms, /api/guests, and /api/bookings</p>');
});

// Mount routers (This is line 26, now using the actual router function)
app.use('/api/rooms', roomRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/bookings', bookingRoutes);

// Start server after DB connects and handle connection errors
const startServer = async () => {
    try {
        // connectDB is now the function itself (not a Promise), so we can await its execution.
        await connectDB();
        app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
    } catch (err) {
        console.error('Failed to connect to database, exiting:', err.message || err);
        process.exit(1);
    }
};

startServer();
