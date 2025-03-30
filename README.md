# 📚 Bookstore REST API

A modern, secure, and scalable RESTful API for managing a digital bookstore. Built with Node.js, Express, and MongoDB, this API provides a robust foundation for building a complete bookstore management system.

## 🌟 Features

### Core Functionality
- 📖 Complete Book Management System
- 👥 User Authentication & Authorization
- 🔍 Advanced Search & Filtering
- 📱 Pagination & Sorting

### Technical Features
- 🔒 JWT-based Authentication
- 🛡️ Input Validation & Sanitization
- ⚡ Rate Limiting
- 🌐 CORS Support
- 📝 Comprehensive Error Handling
- 🧪 Test Coverage
- 🐳 Docker Support

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express Validator
- **Testing**: Jest & Supertest

### Development Tools
- **Package Manager**: npm
- **Version Control**: Git
- **Containerization**: Docker
- **CI/CD**: GitHub Actions

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/bookstore-api.git
cd bookstore-api
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bookstore
JWT_SECRET=your-secret-key
NODE_ENV=development
```

4. Start the server:
```bash
# Development mode with hot-reload
npm run dev

# Production mode
npm start
```

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/user/signup` | Register a new user |
| POST | `/api/user/login` | Authenticate user |
| GET | `/api/user/profile` | Get user profile (Protected) |

### Books
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/store/books` | Get all books |
| GET | `/api/store/books/:id` | Get book by ID |
| POST | `/api/store/books` | Create new book (Protected) |
| PUT | `/api/store/books/:id` | Update book (Protected) |
| DELETE | `/api/store/books/:id` | Delete book (Protected) |

## 🔒 Security Features

- JWT-based Authentication
- Password Hashing with bcrypt
- Input Validation & Sanitization
- CORS Configuration
- Rate Limiting
- Request Size Limits

## 📁 Project Structure
```
bookstore-api/
├── backend/
│   ├── config/         # Configuration files
│   ├── endpoints/      # Route handlers
│   ├── models/         # Database models
│   ├── middleware/     # Custom middleware
│   ├── utils/          # Utility functions
│   └── server.js       # Main application file
├── public/             # Static files
├── tests/              # Test files
├── .env                # Environment variables
├── .gitignore         # Git ignore rules
├── docker-compose.yml # Docker compose config
├── Dockerfile         # Docker configuration
├── package.json       # Project dependencies
└── README.md          # Project documentation
```

## 🧪 Testing

Run the test suite:
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 🐳 Docker Support

Build and run with Docker:
```bash
# Build the image
docker build -t bookstore-api .

# Run the container
docker run -p 5000:5000 bookstore-api
```

Or use Docker Compose:
```bash
docker-compose up
```


## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👥 Author

Anushka Gupta

## 🙏 Acknowledgments

- Express.js team for the amazing framework
- MongoDB team for the powerful database
- All contributors who have helped improve this project

---
Made with ❤️ for the developer community
