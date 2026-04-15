# Quick Start Guide - Gait Recognition Backend

## 🚀 5-Minute Setup

### Step 1: Install Dependencies
```bash
cd "e:/Gait Recognition"
npm install
```

### Step 2: Configure Environment
```bash
# Copy the example env file
copy .env.example .env

# Edit .env with your settings (at minimum):
# - MONGODB_URI
# - JWT_SECRET
# - CLOUDINARY_* credentials
# - SMTP_* email settings
```

### Step 3: Start the Server
```bash
# Development mode (recommended)
npm run dev

# Or production mode
npm start
```

### Step 4: Test the API
```bash
# Health check
curl http://localhost:5000/health

# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!",
    "confirmPassword": "Password123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

## 📁 Project Files Created

### Root Files
- ✅ `package.json` - Dependencies and scripts
- ✅ `.env.example` - Environment template
- ✅ `.gitignore` - Git ignore rules
- ✅ `README.md` - Full documentation
- ✅ `SETUP.md` - Setup instructions

### Core Application
- ✅ `src/index.js` - Express app entry point
- ✅ `src/config/` - Database, Cloudinary, Constants configuration
- ✅ `src/middleware/` - Auth, RBAC, Validation, Error handling, Rate limiting, File upload
- ✅ `src/utils/` - JWT, Email, API Response, Encryption utilities
- ✅ `src/modules/` - Three complete modules with MVC architecture

### Auth Module
- ✅ `auth.model.js` - MongoDB schema
- ✅ `auth.controller.js` - Request handlers
- ✅ `auth.service.js` - Business logic (Register, Login, OTP, Tokens)
- ✅ `auth.routes.js` - API endpoints
- ✅ `auth.validation.js` - Joi validation schemas

### User Module
- ✅ `user.model.js` - User schema with preferences
- ✅ `user.controller.js` - User operations
- ✅ `user.service.js` - User management logic
- ✅ `user.routes.js` - User endpoints (CRUD + Admin)
- ✅ `user.validation.js` - User validation schemas

### Message Module
- ✅ `message.model.js` - Message schema
- ✅ `message.controller.js` - Message handlers
- ✅ `message.service.js` - Messaging logic
- ✅ `message.routes.js` - Message endpoints
- ✅ `message.validation.js` - Message validation schemas

### Utilities
- ✅ `generateToken.js` - JWT access & refresh tokens
- ✅ `sendEmail.js` - OTP, verification, reset emails
- ✅ `apiResponse.js` - Standardized API responses
- ✅ `encryption.js` - Password hashing, OTP generation

### Middleware
- ✅ `authentication.js` - JWT verification
- ✅ `authorization.js` - Role-based access control
- ✅ `validation.js` - Request validation (body, query, params)
- ✅ `errorHandler.js` - Global error handling
- ✅ `rateLimiter.js` - Rate limiting configurations
- ✅ `fileUpload.js` - Multer file upload setup

## 🎯 Key Features Implemented

### ✅ Authentication
- JWT-based auth with access & refresh tokens
- OTP email verification
- Password hashing with bcryptjs
- Session management

### ✅ Authorization
- Role-Based Access Control (RBAC)
- Admin, User, Moderator roles
- Route-level authorization

### ✅ User Management
- Registration & Login
- Profile management
- Profile picture upload (Cloudinary)
- User preferences
- Admin user management

### ✅ Messaging
- Send/receive messages
- Conversations management
- Message editing & deletion
- Read status tracking
- File attachments

### ✅ Security
- Rate limiting (different rates per endpoint)
- CORS configuration
- Input validation with Joi
- Error handling & logging
- Password security

### ✅ File Management
- Multer file upload
- Cloudinary integration
- File type validation
- File size limits

## 📊 API Endpoints Summary

### Authentication (Public)
- `POST /api/auth/register` - Register user
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh-token` - Refresh token
- `POST /api/auth/logout` - Logout (Protected)

### Users (Protected)
- `GET /api/users/profile` - Get profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/profile/picture` - Upload picture
- `GET /api/users` - List users (Admin)
- `GET /api/users/:userId` - Get user
- `PUT /api/users/:userId` - Update user (Admin)
- `DELETE /api/users/:userId` - Delete user (Admin)
- `PUT /api/users/:userId/role` - Update role (Admin)

### Messages (Protected)
- `POST /api/messages/send` - Send message
- `GET /api/messages/conversations` - Get conversations
- `GET /api/messages/:userId` - Get messages
- `PUT /api/messages/:messageId` - Edit message
- `DELETE /api/messages/:messageId` - Delete message
- `POST /api/messages/mark-as-read` - Mark as read
- `GET /api/messages/unread-count` - Get unread count

### Health
- `GET /health` - Health check

## 🔧 Configuration Guide

### Database
```env
MONGODB_URI=mongodb://localhost:27017/gait-recognition
```

### JWT
```env
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRY=7d
```

### Email (Gmail SMTP)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=app_specific_password  # Not your Gmail password
```

### Cloudinary
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 📝 Code Quality

- ✅ Clean modular architecture
- ✅ Async/await patterns
- ✅ Comprehensive error handling
- ✅ Input validation
- ✅ Security best practices
- ✅ Production-ready code
- ✅ Detailed code comments
- ✅ Consistent naming conventions

## 🚀 Next Steps

1. Install dependencies: `npm install`
2. Configure `.env` file with your credentials
3. Start MongoDB service
4. Run development server: `npm run dev`
5. Test endpoints using Postman or Thunder Client
6. Connect frontend application to this backend
7. Deploy to production (Heroku, AWS, etc.)

## 📚 Documentation Files

- **README.md** - Complete API documentation
- **SETUP.md** - Detailed setup instructions
- **Code Comments** - Inline documentation in all files

## ⚠️ Important Security Notes

1. Never commit `.env` file with real credentials
2. Use strong JWT secret in production
3. Change default passwords
4. Keep dependencies updated
5. Enable HTTPS in production
6. Use rate limiting
7. Implement API versioning for future updates

## 🆘 Troubleshooting

### "Cannot find module" errors
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in .env
- Verify network access if using MongoDB Atlas

### Port Already in Use
```bash
# Change PORT in .env
PORT=5001
```

### Email Not Sending
- Use Gmail app-specific password (not account password)
- Enable less secure app access if needed
- Check SMTP settings

## 🎓 Learning Resources

- Express.js: https://expressjs.com/
- MongoDB: https://docs.mongodb.com/
- Mongoose: https://mongoosejs.com/
- JWT: https://jwt.io/
- Joi: https://joi.dev/

---

**Congratulations! Your Gait Recognition Backend is ready! 🎉**

For detailed documentation, see [README.md](./README.md)
