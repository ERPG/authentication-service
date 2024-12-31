# Authentication Service Microservice

This microservice handles user authentication and authorization using a PostgreSQL database, Fastify, and Prisma. It supports user registration, login, and token-based access to protected routes.

## Table of Contents
- [Features](#features)
- [Technologies](#technologies)
- [Setup and Installation](#setup-and-installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Docker](#docker)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- User registration with hashed password storage.
- User login with JWT token generation.
- Middleware-based route protection.
- Prisma ORM for database access.
- Dockerized PostgreSQL database.
- Clean architecture with Hexagonal principles.

---

## Technologies

- **Node.js** with Fastify
- **Prisma** for database interaction
- **PostgreSQL** as the database
- **Docker** for containerization
- **TypeScript** for type safety

---

## Setup and Installation

### 1. Clone the Repository

```
git clone https://github.com/your-repo/authentication-service.git
cd authentication-service
```

### 2. install dependencies

```
pnpm install
```

### 3. Setup the Environment Variables

```
DATABASE_URL=postgresql://user:password@localhost:5432/auth_service
JWT_SECRET=your_secret_key
```

### 4. Start dockerized database

```
pnpm run start:db
```

### 5. Start dockerized database

```
npx prisma migrate dev
```

### 6. Start the Development Server

```
pnpm run dev
```

---

## API Endpoints

### 1. Register User

**POST** `/register`

Registers a new user.

### 2. Login User

**POST** `/login`

Authenticates a user and returns a JWT token.

### 3. Access Protected Route

**GET** `/protected`

Access a protected route using a valid JWT token.

---

## Future Improvements

- Implement role-based access control (RBAC).
- Add password reset functionality.
- Extend token validation with refresh tokens.
- Integrate API rate limiting for better security.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.