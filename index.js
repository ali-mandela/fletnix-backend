const express = require('express');
require('dotenv').config(); // Load environment variables from .env file
const authRoute = require('./routes/authRoutes'); // Import authentication routes
const movieRoutes = require('./routes/movieRoutes'); // Import movie-related routes
const morgan = require('morgan'); // Logger middleware for monitoring API requests
const cors = require('cors'); // Enable Cross-Origin Resource Sharing
const { connectDB } = require('./config/database'); // Database connection function

const app = express();

// Establish database connection
connectDB();

// Middleware to parse JSON request bodies
app.use(express.json());

// Enable CORS for cross-origin API requests
app.use(cors());

// Log HTTP requests in a compact format
app.use(morgan('tiny'));

// Api to test server is live
app.get('/', (req, res) => {
    res.send('Server is live');
});

// Mount authentication routes under /api/auth
app.use('/api/auth', authRoute);

// Mount movie-related routes under /api/movies
app.use('/api/movies', movieRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Send standardized error response
    return res.status(statusCode).send({
        success: false,
        statusCode,
        message,
    });
});

// Start the server and listen on the specified port
app.listen(process.env.PORT, () => {
    console.log(`Server is live on port ${process.env.PORT}`);
});
