# Interact Backend

A modern backend service built with Node.js, Express, and TypeScript. This project features a robust architecture with complete authentication system, database integration, and API endpoints.

## 🚀 Tech Stack

- **Runtime**: Node.js (>=22.12.0)
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: Prisma ORM
- **Authentication**: Passport.js (JWT, Local Strategy)
- **Security**: Helmet, CORS, Cookie Parser
- **Code Quality**: ESLint, Prettier, Husky

## 📋 Prerequisites

- Node.js >= 22.12.0
- npm or yarn
- Docker (optional, for containerized deployment)

## 🛠️ Installation

1. Clone the repository

```bash
git clone [repository-url]
cd interact-backend
```

2. Install dependencies

```bash
npm install
```

3. Environment setup

```bash
# For development
cp .env.development .env

# For production
cp .env.production .env
```

Modify the environment variables in `.env` file according to your needs.

4. Database setup

```bash
npx prisma db push
```

## 🏃‍♂️ Development

Start the development server:

```bash
npm run dev
```

## 📦 Build

Build the project:

```bash
npm run build
```

## 🚀 Start

Start production server:

```bash
npm start
```

## 📁 Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Controllers
├── libs/          # Utility functions
├── middleware/    # Middleware
├── repositories/  # Database operations
├── routes/        # Route definitions
├── services/      # Business logic
├── types/         # TypeScript type definitions
├── app.ts         # Express app configuration
└── server.ts      # Server entry point
```

## 🔐 Environment Variables

Required environment variables:

- `DATABASE_URL`: MongoDB connection string
- `JWT_ACCESS_SECRET`: Secret key for access token
- `JWT_REFRESH_SECRET`: Secret key for refresh token
- `NODE_ENV`: Environment mode (development/production)
- `DOMAIN`: Domain name for cookie settings
- `PORT`: Server port (default: 8080)

## 🐳 Docker Support

Start the service using Docker Compose:

```bash
docker-compose up -d
```

## 📝 Code Style

The project uses ESLint and Prettier for code formatting. Code is automatically formatted and checked before commits.

## 📄 License

This is a private project. All rights reserved. Unauthorized copying, modification, distribution, or use of this project, via any medium, is strictly prohibited.
