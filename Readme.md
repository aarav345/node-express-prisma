# Lesson 1: Environment Setup & Prisma Basics

## 📚 What You'll Learn

- Set up Node.js/Express/TypeScript with Prisma
- Understand Prisma schema structure
- Create your first data model
- Perform CRUD operations
- Handle database connections properly
- Common Prisma errors and solutions

---

## 🎯 Learning Objectives

By the end of this lesson, you'll be able to:
- ✅ Configure a complete Prisma development environment
- ✅ Define database models using Prisma Schema Language
- ✅ Generate and use type-safe Prisma Client
- ✅ Build RESTful API endpoints with CRUD operations
- ✅ Handle Prisma-specific errors gracefully
- ✅ Follow best practices for production code

---

## 🛠️ Prerequisites

Before starting, ensure you have:
- **Node.js** (v18 or higher): `node --version`
- **PostgreSQL** (v12 or higher): `psql --version`
- **npm** or **yarn**: `npm --version`
- Basic understanding of:
  - JavaScript/TypeScript
  - Async/await
  - RESTful APIs
  - SQL basics (helpful but not required)

---

## 📦 Installation & Setup

### Step 1: Create Project Directory

```bash
mkdir prisma-course
cd prisma-course
```

### Step 2: Initialize Node.js Project

```bash
npm init -y
```

### Step 3: Install Dependencies

```bash
# Core dependencies
npm install express

# Development dependencies
npm install -D typescript @types/express @types/node ts-node-dev

# Prisma (use v5 for stability)
npm install -D prisma@5.22.0
npm install @prisma/client@5.22.0
```

### Step 4: Initialize TypeScript

```bash
npx tsc --init
```

Update `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### Step 5: Initialize Prisma

```bash
npx prisma init
```

This creates:
- `prisma/schema.prisma` - Your data model definition
- `.env` - Environment variables (DATABASE_URL)

### Step 6: Configure Database Connection

Update `.env`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/prisma_course?schema=public"
```

**Connection String Format:**
```
postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]?schema=[SCHEMA]
```

---

## 📁 Project Structure

```
prisma-course/
├── prisma/
│   ├── schema.prisma           # Data model definitions
│   └── migrations/             # Database migrations (auto-generated)
├── src/
│   ├── lib/
│   │   └── prisma.ts          # Prisma Client singleton
│   ├── routes/
│   │   └── users.ts           # User CRUD routes
│   └── index.ts               # Express server setup
├── .env                        # Environment variables
├── .gitignore                  # Git ignore file
├── package.json                # Project dependencies
├── tsconfig.json              # TypeScript configuration
└── README.md                   # This file
```

---

## 🗄️ Database Schema

Create your first model in `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  password  String
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Understanding the Schema

| Attribute | Purpose | Example |
|-----------|---------|---------|
| `@id` | Primary key | `id Int @id` |
| `@unique` | Unique constraint | `email String @unique` |
| `@default()` | Default value | `@default(true)` |
| `@updatedAt` | Auto-update timestamp | `updatedAt DateTime @updatedAt` |
| `?` | Optional/nullable field | `name String?` |

### Common Field Types

| Prisma Type | PostgreSQL Type | TypeScript Type |
|-------------|----------------|-----------------|
| `String` | VARCHAR/TEXT | `string` |
| `Int` | INTEGER | `number` |
| `BigInt` | BIGINT | `bigint` |
| `Float` | DOUBLE PRECISION | `number` |
| `Boolean` | BOOLEAN | `boolean` |
| `DateTime` | TIMESTAMP | `Date` |
| `Json` | JSONB | `JsonValue` |

---

## 🚀 Running the Application

### Generate Prisma Client

```bash
npx prisma generate
```

### Create Database & Run Migrations

```bash
npx prisma migrate dev --name init
```

### Start Development Server

```bash
npm run dev
```

Server should start at: `http://localhost:3000`

---

## 📡 API Endpoints

### Base URL
```
http://localhost:3000/api/users
```

### Available Endpoints

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| `POST` | `/api/users` | Create user | `{email, name?, password}` |
| `GET` | `/api/users` | Get all users | - |
| `GET` | `/api/users/:id` | Get user by ID | - |
| `PUT` | `/api/users/:id` | Update user | `{name?, email?, isActive?}` |
| `DELETE` | `/api/users/:id` | Delete user | - |

---

## 🧪 Testing the API

### Using cURL

```bash
# Create a user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "name": "John Doe",
    "password": "secret123"
  }'

# Get all users
curl http://localhost:3000/api/users

# Get single user
curl http://localhost:3000/api/users/1

# Update user
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "John Updated"}'

# Delete user
curl -X DELETE http://localhost:3000/api/users/1
```

### Expected Responses

**Create User (201 Created):**
```json
{
  "id": 1,
  "email": "john@example.com",
  "name": "John Doe",
  "password": "secret123",
  "isActive": true,
  "createdAt": "2024-12-11T16:30:00.000Z",
  "updatedAt": "2024-12-11T16:30:00.000Z"
}
```

**Get All Users (200 OK):**
```json
[
  {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe",
    "isActive": true,
    "createdAt": "2024-12-11T16:30:00.000Z"
  }
]
```

---

## ⚠️ Common Errors & Solutions

### Error: "Can't reach database server"

**Cause:** PostgreSQL not running or wrong connection string

**Solution:**
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Start PostgreSQL
sudo systemctl start postgresql

# Verify connection string in .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/prisma_course"
```

---

### Error: "Database does not exist"

**Solution:**
```bash
# Create database manually
psql -U postgres
CREATE DATABASE prisma_course;
\q

# Then run migrations
npx prisma migrate dev
```

---

### Error: "Unique constraint failed on email"

**HTTP Status:** 409 Conflict

**Cause:** Trying to create user with existing email

**Solution:** Use different email or update existing user

---

### Error: "Record not found (P2025)"

**HTTP Status:** 404 Not Found

**Cause:** Trying to update/delete non-existent record

**Solution:** Verify the ID exists before operation

---

### Error: "@prisma/client did not initialize yet"

**Solution:**
```bash
npx prisma generate
```

---

### Error: Prisma v7 Constructor Validation Error

**Solution:** Downgrade to Prisma v5
```bash
npm uninstall prisma @prisma/client
npm install prisma@5.22.0 -D
npm install @prisma/client@5.22.0
npx prisma generate
```

---

## 📊 Common Prisma Error Codes

| Code | Meaning | Common Cause |
|------|---------|--------------|
| `P2002` | Unique constraint violation | Duplicate email/username |
| `P2025` | Record not found | Invalid ID in update/delete |
| `P2003` | Foreign key constraint | Referenced record missing |
| `P2014` | Relation violation | Required relation missing |
| `P1001` | Can't reach database | Connection string error |
| `P1008` | Operation timeout | Query too slow |

---

## 🎯 Best Practices

### 1. Use Prisma Client Singleton

❌ **Bad:**
```typescript
// Creating new instance in every file
const prisma = new PrismaClient();
```

✅ **Good:**
```typescript
// src/lib/prisma.ts - Single shared instance
export const prisma = new PrismaClient();
```

---

### 2. Always Select Specific Fields

❌ **Bad:**
```typescript
// Returns all fields including password
const user = await prisma.user.findUnique({ where: { id: 1 } });
```

✅ **Good:**
```typescript
// Explicitly exclude sensitive data
const user = await prisma.user.findUnique({
  where: { id: 1 },
  select: {
    id: true,
    email: true,
    name: true,
    createdAt: true,
  },
});
```

---

### 3. Handle Errors Properly

❌ **Bad:**
```typescript
try {
  const user = await prisma.user.create({ data });
} catch (error) {
  console.log(error); // Generic error
}
```

✅ **Good:**
```typescript
try {
  const user = await prisma.user.create({ data });
} catch (error: any) {
  if (error.code === 'P2002') {
    return res.status(409).json({ error: 'Email already exists' });
  }
  res.status(500).json({ error: 'Failed to create user' });
}
```

---

### 4. Always Disconnect on Shutdown

✅ **Good:**
```typescript
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
```

---

### 5. Enable Query Logging (Development)

```typescript
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
```

---

## 🏋️ Practical Exercises

### Exercise 1: Add Blog Post Model

Create a `Post` model with the following fields:
- `id` (Int, auto-increment)
- `title` (String)
- `content` (String, optional)
- `published` (Boolean, default false)
- `authorEmail` (String)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

Implement CRUD endpoints for posts.

---

### Exercise 2: Conditional Queries

Implement an endpoint that fetches:
- Only active users
- Created in the last 30 days
- Sorted by creation date (newest first)

**Hint:**
```typescript
where: {
  isActive: true,
  createdAt: {
    gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  }
},
orderBy: {
  createdAt: 'desc'
}
```

---

### Exercise 3: Error Handler Middleware

Create a centralized error handler:
```typescript
// src/middleware/errorHandler.ts
export const errorHandler = (err, req, res, next) => {
  // Handle Prisma errors
  // Log errors
  // Return appropriate response
};
```

---

## 🔍 Useful Prisma Commands

```bash
# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name migration_name

# Apply migrations to production
npx prisma migrate deploy

# Reset database (⚠️ deletes all data)
npx prisma migrate reset

# Open Prisma Studio (GUI)
npx prisma studio

# Validate schema
npx prisma validate

# Format schema file
npx prisma format

# View database schema
npx prisma db pull

# Push schema without migrations (prototyping)
npx prisma db push
```

---

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

## ✅ Lesson Checklist

Before moving to Lesson 2, ensure you can:

- [ ] Set up a Node.js/Express/TypeScript project
- [ ] Install and configure Prisma
- [ ] Define a data model in Prisma Schema
- [ ] Generate Prisma Client
- [ ] Create and run migrations
- [ ] Implement CRUD operations
- [ ] Handle Prisma-specific errors
- [ ] Use Prisma Client singleton pattern
- [ ] Test API endpoints with cURL or Postman
- [ ] Understand common Prisma error codes

---

## 🎓 Quiz Yourself

1. What command generates Prisma Client?
2. What does the `@updatedAt` attribute do?
3. How do you make a field optional in Prisma?
4. What error code indicates a unique constraint violation?
5. Why should you use `select` when fetching sensitive data?
6. What's the benefit of using a Prisma Client singleton?
7. How do you handle graceful shutdown with Prisma?

**Answers:**
1. `npx prisma generate`
2. Automatically updates the field timestamp on record modification
3. Add `?` after the type (e.g., `name String?`)
4. `P2002`
5. To exclude sensitive fields like passwords from responses
6. Reuses connection pool, prevents "too many connections" errors
7. Call `prisma.$disconnect()` in SIGINT/SIGTERM handlers

---

## 📖 Next Lesson Preview

**Lesson 2: Schema Design & Data Modeling**

Topics covered:
- Advanced field types (enums, JSON, arrays)
- Validation with `@db` attributes
- Custom database column names
- Indexes and constraints
- Schema organization strategies
- Enums and custom types

---

## 💬 Need Help?

Common issues and where to find solutions:
- **Prisma Errors:** Check error codes in this README
- **Connection Issues:** Verify PostgreSQL is running
- **Type Errors:** Regenerate Prisma Client with `npx prisma generate`
- **Migration Issues:** Check `prisma/migrations` folder

---

## 🎉 Congratulations!

You've completed Lesson 1! You now have a solid foundation in:
- Prisma setup and configuration
- Basic CRUD operations
- Error handling
- Production best practices

**Ready for Lesson 2?** 🚀

---

**Last Updated:** December 2024  
**Prisma Version:** 5.22.0  
**Node.js Version:** 18+  
**PostgreSQL Version:** 12+