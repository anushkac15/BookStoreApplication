// Store endpoint is used to add or retrieve book data from the books collection only.
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Book = require('../models/book');
const verifyToken = require('../config/auth');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

// Validation middleware
const validateBook = [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('author').trim().notEmpty().withMessage('Author is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('rating').isFloat({ min: 0, max: 5 }).withMessage('Rating must be between 0 and 5')
];

// Get all books with filtering, search, and pagination
router.get('/', auth, async (req, res) => {
    try {
        const { search, category, minRating, sort = 'createdAt', order = 'desc', page = 1, limit = 10 } = req.query;
        const query = { user: req.user.id };
        
        // Apply filters
        if (search) {
            query.$or = [
                { title: new RegExp(search, 'i') },
                { author: new RegExp(search, 'i') }
            ];
        }
        if (category) {
            query.category = new RegExp(category, 'i');
        }
        if (minRating) {
            query.rating = { $gte: parseFloat(minRating) };
        }

        // Apply sorting
        const sortOptions = {};
        sortOptions[sort] = order === 'desc' ? -1 : 1;

        const books = await Book.find(query)
            .sort(sortOptions)
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const total = await Book.countDocuments(query);

        res.json({
            books,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
            totalBooks: total
        });
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get book by title
router.get('/title/:title', verifyToken, async (req, res) => {
    try {
        const _title = req.params.title;
        const books = await Book.find({ 
            title: new RegExp(_title, 'i') 
        });
        
        if (!books.length) {
            return res.status(404).json({
                message: 'No books found with this title'
            });
        }

        res.json({
            message: 'Books found successfully',
            books
        });
    } catch (error) {
        console.error('Get book by title error:', error);
        res.status(400).json({ error: error.message });
    }
});

// Get book by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const book = await Book.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        res.json(book);
    } catch (error) {
        console.error('Error fetching book:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create new book
router.post('/', auth, validateBook, async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, author, category, price, rating } = req.body;
        
        // Create new book with user ID
        const book = new Book({
            title,
            author,
            category,
            price: parseFloat(price),
            rating: parseFloat(rating),
            user: req.user.id
        });

        await book.save();
        res.status(201).json(book);
    } catch (error) {
        console.error('Error creating book:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update book
router.put('/:id', auth, validateBook, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const book = await Book.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        res.json(book);
    } catch (error) {
        console.error('Error updating book:', error);
        res.status(500).json({ error: error.message });
    }
});

// Delete book
router.delete('/:id', auth, async (req, res) => {
    try {
        const book = await Book.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 