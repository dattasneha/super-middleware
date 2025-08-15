# @snehadatta/super-middleware

A collection of **reusable Express.js middleware** for:

- JWT Authentication
- Role-based Authorization
- Error Handling
- ETag-based Caching

---

## Features

- **`jwtAuth`** – Authenticate users with JWT from cookies or `Authorization` header.
- **`roleAuth`** – Restrict access based on user roles.
- **`errorHandler`** – Centralized JSON error responses.
- **`notFoundErrorHandler`** – Consistent 404 responses.
- **`etagMiddleware`** – Adds ETag headers for GET requests to improve caching.

---
## Installation
```
npm install @snehadatta/super-middleware
```
## Quick Start

```javascript
  import express from 'express';
  import {
    jwtAuth,
    roleAuth,
    errorHandler,
    notFoundErrorHandler,
    etagMiddleware
  } from 'express-middleware-kit';
  
  const app = express();
  
  // Enable ETag caching
  app.use(etagMiddleware);
  
  // JWT Authentication
  app.use(jwtAuth(process.env.JWT_SECRET, async (userId) => {
    // Fetch user from DB
    return { id: userId, role: 'admin' };
  }));
  
  // Public route
  app.get('/', (req, res) => {
    res.send('Hello World!');
  });
  
  // Protected route
  app.get('/profile', (req, res) => {
    res.json({ user: req.user });
  });
  
  // Role-based route
  app.get('/admin', roleAuth(['admin']), (req, res) => {
    res.send('Welcome Admin!');
  });
  
  // 404 handler
  app.use(notFoundErrorHandler);
  
  // Error handler
  app.use(errorHandler);
  
  app.listen(3000, () => console.log('Server running on port 3000'));
  
  ```
## API Reference

### `jwtAuth(secret, getUser)`

Middleware to verify a JWT token and authenticate a user.

#### Parameters:

secret	string - JWT secret key used to verify token<br>
getUser	function - Async function to fetch a user by decoded ID

#### Example:
```javascript
app.use(jwtAuth('mysecret', async (id) => {
  return db.findUserById(id);
}));
```
### `roleAuth(allowedRoles)`

Restricts access to routes based on user roles.

#### Parameters:

allowedRoles	string[] - Array of allowed roles

### Example:
```javascript
app.get('/admin', roleAuth(['admin']), (req, res) => {
  res.send('Welcome Admin!');
});
```
### `errorHandler(err, req, res, next)`

Centralized error handler for consistent JSON responses.

#### Usage
```javascript
app.use(errorHandler);
```
### `notFoundErrorHandler(req, res, next)`

Handles 404 Not Found responses in JSON format.

#### Usage
```javascript
app.use(notFoundErrorHandler);
```
### `etagMiddleware(req, res, next)`

Generates an ETag for GET responses.
If the If-None-Match header matches the ETag, sends 304 Not Modified.

#### Usage
```javascript
app.use(etagMiddleware);
```
## Contributing

Fork the repository

Create a feature branch:
```bash
git checkout -b feature/my-feature
```

Commit changes:
```bash
git commit -m "Add my feature"
```

Push and open a Pull Request

## Support

If you encounter any issues or have questions, please open an issue for assistance.