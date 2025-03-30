const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const User = require('../models/user');
const Book = require('../models/book');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

beforeEach(async () => {
    await User.deleteMany({});
    await Book.deleteMany({});
});

describe('Authentication', () => {
    test('should register a new user', async () => {
        const res = await request(app)
            .post('/api/user/signup')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('token');
        expect(res.body).toHaveProperty('user');
    });

    test('should login existing user', async () => {
        // First register a user
        await request(app)
            .post('/api/user/signup')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });

        // Then try to login
        const res = await request(app)
            .post('/api/user/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    });
});

describe('Books API', () => {
    let token;

    beforeEach(async () => {
        // Register and login a user
        const registerRes = await request(app)
            .post('/api/user/signup')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });
        token = registerRes.body.token;
    });

    test('should create a new book', async () => {
        const res = await request(app)
            .post('/api/store')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Test Book',
                author: 'Test Author',
                category: 'Test Category',
                price: 29.99,
                rating: 4.5,
                publishedDate: '2024-03-30'
            });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('book');
    });

    test('should get all books', async () => {
        // First create a book
        await request(app)
            .post('/api/store')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Test Book',
                author: 'Test Author',
                category: 'Test Category',
                price: 29.99,
                rating: 4.5,
                publishedDate: '2024-03-30'
            });

        // Then get all books
        const res = await request(app)
            .get('/api/store')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('books');
        expect(res.body.books).toHaveLength(1);
    });

    test('should filter books by category', async () => {
        // Create multiple books
        await request(app)
            .post('/api/store')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Test Book 1',
                author: 'Test Author 1',
                category: 'Fiction',
                price: 29.99,
                rating: 4.5,
                publishedDate: '2024-03-30'
            });

        await request(app)
            .post('/api/store')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Test Book 2',
                author: 'Test Author 2',
                category: 'Non-Fiction',
                price: 39.99,
                rating: 4.8,
                publishedDate: '2024-03-30'
            });

        // Filter by category
        const res = await request(app)
            .get('/api/store?category=Fiction')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.books).toHaveLength(1);
        expect(res.body.books[0].category).toBe('Fiction');
    });
}); 