const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        console.log('MongoDB URI:', process.env.MONGODB_URI);

        const conn = await mongoose.connect("mongodb+srv://anushkacgupta10:anushka%4020@cluster0.bzn8w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        // console.log(`MongoDB Connected: ${conn.connection.host}`);
        // console.log(`Database: ${conn.connection.name}`);
        // console.log(`Port: ${conn.connection.port}`);

        // Handle connection errors after initial connection
        mongoose.connection.on('error', err => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

        // Handle application termination
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('MongoDB connection closed through app termination');
            process.exit(0);
        });

    } catch (error) {
        console.error('MongoDB connection error:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            code: error.code
        });
        process.exit(1);
    }
};

module.exports = connectDB; 
