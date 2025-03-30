const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dbUrl = require('./backend/config/db');
const path = require('path');
const cors = require('cors');

const storeRoutes = require('./backend/endpoints/store');
const userRoutes = require('./backend/endpoints/user');
const bodyParser = require('body-parser');

// Connect to MongoDB with proper options
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
.then(() => {
    console.log('MongoDB Connected Successfully');
})
.catch((err) => {
    console.error('MongoDB Connection Error:', err);
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use('/api/store', storeRoutes);
app.use('/api/user', userRoutes);

// Error handling middleware
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
            status: error.status
        }
    });
});

module.exports = app;