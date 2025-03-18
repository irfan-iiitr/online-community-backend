# Online Community Microservice Architecture

A microservice-based Online Community platform using Node.js, Express, MongoDB, and RabbitMQ.

## Project Structure

```
social-media-microservice/
├── api-gateway/                # API Gateway Service
│   ├── middleware/
│   │   ├── error-handler.js   # Error handling middleware
│   │   └── validate-token.js  # JWT validation middleware
│   ├── utils/
│   │   └── logger.js         # Winston logger configuration
│   ├── .env                  # Environment variables
│   ├── Dockerfile           # Docker configuration
│   ├── index.js            # Main application file
│   └── package.json        # Dependencies and scripts
│
├── user/                    # User Service
│   ├── controllers/
│   │   └── user-controller.js
│   ├── middleware/
│   │   └── error-handler.js
│   ├── models/
│   │   ├── Users.js
│   │   └── refresh-token.js
│   ├── routes/
│   │   └── index.js
│   ├── utils/
│   │   ├── logger.js
│   │   ├── token-generator.js
│   │   └── validation.js
│   ├── .env
│   ├── Dockerfile
│   └── index.js
│
├── post/                    # Post Service
│   ├── controllers/
│   │   └── post-controller.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── error-handler.js
│   ├── models/
│   │   └── Post.js
│   ├── routes/
│   │   └── index.js
│   ├── utils/
│   │   ├── logger.js
│   │   ├── rabbit.js
│   │   └── validation.js
│   ├── .env
│   ├── Dockerfile
│   └── index.js
│
├── content/                 # Content Service
│   ├── controllers/
│   │   └── index.js
│   ├── eventHandlers/
│   │   └── delete-post.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── error-handler.js
│   ├── models/
│   │   └── content.js
│   ├── routes/
│   │   └── index.js
│   ├── utils/
│   │   ├── cloudinary.js
│   │   ├── logger.js
│   │   └── rabbit.js
│   ├── .env
│   ├── Dockerfile
│   └── index.js
│
├── search/                  # Search Service
│   ├── controllers/
│   │   └── index.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── error-handler.js
│   ├── models/
│   │   └── searchPostSchema.js
│   ├── routes/
│   │   └── index.js
│   ├── utils/
│   │   ├── logger.js
│   │   ├── new-post-event.js
│   │   └── rabbit.js
│   ├── .env
│   ├── Dockerfile
│   └── index.js
│
├── .gitignore              # Git ignore file
└── docker-compose.yml      # Docker compose configuration
```

## Service Overview

1. **API Gateway (Port 3000)**
   - Entry point for all client requests
   - Routes requests to appropriate services
   - Handles authentication and authorization

2. **User Service (Port 3001)**
   - User registration and authentication
   - JWT token management
   - User profile management

3. **Post Service (Port 3002)**
   - Create, read, update, delete posts
   - Post management and storage
   - Event publishing for post updates

4. **Content Service (Port 3003)**
   - Media file management
   - Cloudinary integration for file storage
   - Event handling for content deletion

5. **Search Service (Port 3004)**
   - Full-text search capabilities
   - Post indexing and search
   - Event handling for post updates 