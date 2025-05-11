# News CMS

A Content Management System for online news websites built with Node.js, Express, and PostgreSQL.

## Features

- Role-Based Access Control (RBAC)
- User Authentication and Authorization
- Content Creation and Management
- Category Management
- Media Upload and Management
- RESTful API

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)

## Installation

1. Clone the repository

```bash
git clone <repository-url>
cd news-cms
```

2. Install dependencies

```bash
npm install
```

3. Set up PostgreSQL database

```bash
# Create a new database
createdb news_cms

# Or using psql
psql -U postgres
CREATE DATABASE news_cms;
\q
```

4. Create a `.env` file in the root directory and add the following variables:

```
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=news_cms
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
```

5. Start the development server

```bash
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get current user

### Users

- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get a user by ID
- `POST /api/users` - Create a new user (Admin only)
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user

### Roles

- `GET /api/roles` - Get all roles
- `GET /api/roles/:id` - Get a role by ID
- `POST /api/roles` - Create a new role (Admin only)
- `PUT /api/roles/:id` - Update a role (Admin only)
- `DELETE /api/roles/:id` - Delete a role (Admin only)

### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get a category by ID
- `POST /api/categories` - Create a new category (Editor or Admin)
- `PUT /api/categories/:id` - Update a category (Editor or Admin)
- `DELETE /api/categories/:id` - Delete a category (Admin only)

### Articles

- `GET /api/articles` - Get all articles
- `GET /api/articles/:id` - Get an article by ID
- `POST /api/articles` - Create a new article (Writer, Editor, or Admin)
- `PUT /api/articles/:id` - Update an article (Owner, Editor, or Admin)
- `DELETE /api/articles/:id` - Delete an article (Owner, Editor, or Admin)

## Default Users

After initializing the database, the following user is created:

- Email: admin@example.com
- Password: password
- Role: Admin

## License

ISC
