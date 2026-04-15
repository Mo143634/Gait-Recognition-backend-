# Gait Recognition Backend

A production-ready Node.js backend API for the Gait Recognition System built with Express.js, MongoDB, and modern best practices.

## 📋 Features

### Authentication & Security
- ✅ JWT-based authentication (access & refresh tokens)
- ✅ Password hashing with bcryptjs
- ✅ OTP email verification
- ✅ Role-Based Access Control (RBAC)
- ✅ Rate limiting middleware
- ✅ CORS configuration

### User Management
- ✅ User registration & login
- ✅ Profile management
- ✅ Profile picture upload with Cloudinary
- ✅ User role management (admin, user, moderator)
- ✅ User preferences management

### Messaging System
- ✅ Send/receive messages
- ✅ Message conversations
- ✅ Mark messages as read
- ✅ Edit messages
- ✅ Delete messages
- ✅ Unread message count
- ✅ File attachments support

### File Management
- ✅ Multer file upload
- ✅ Cloudinary integration
- ✅ File validation

### API Features
- ✅ Comprehensive error handling
- ✅ Request validation with Joi
- ✅ Async/await pattern
- ✅ API response standardization
- ✅ Health check endpoint
- ✅ Detailed API documentation with comments

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Email Service**: Nodemailer
- **File Upload**: Multer
- **Cloud Storage**: Cloudinary
- **Validation**: Joi
- **CORS**: cors
- **Rate Limiting**: express-rate-limit
- **Development**: Nodemon

## 📁 Project Structure

```
gait-recognition-backend/
├── src/
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   ├── cloudinary.js        # Cloudinary setup
│   │   └── constants.js         # App constants
│   ├── middleware/
│   │   ├── authentication.js    # JWT authentication
│   │   ├── authorization.js     # RBAC middleware
│   │   ├── validation.js        # Request validation
│   │   ├── errorHandler.js      # Global error handling
│   │   ├── rateLimiter.js       # Rate limiting
│   │   └── fileUpload.js        # Multer configuration
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.model.js
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.service.js
│   │   │   ├── auth.routes.js
│   │   │   └── auth.validation.js
│   │   ├── user/
│   │   │   ├── user.model.js
│   │   │   ├── user.controller.js
│   │   │   ├── user.service.js
│   │   │   ├── user.routes.js
│   │   │   └── user.validation.js
│   │   └── message/
│   │       ├── message.model.js
│   │       ├── message.controller.js
│   │       ├── message.service.js
│   │       ├── message.routes.js
│   │       └── message.validation.js
│   ├── utils/
│   │   ├── generateToken.js     # JWT utilities
│   │   ├── sendEmail.js         # Email service
│   │   ├── apiResponse.js       # Response helper
│   │   └── encryption.js        # Encryption utilities
│   └── index.js                 # Entry point
├── uploads/                      # File uploads directory
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies
└── README.md                    # Documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js >= 14.x
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository** (or extract the project)
```bash
cd gait-recognition-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
```

4. **Configure `.env` file**
Edit `.env` and update the following:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/gait-recognition

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRY=7d

# Email (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_specific_password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Running the Server

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Verify OTP
```
POST /auth/verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Refresh Token
```
POST /auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "your_refresh_token"
}
```

#### Logout
```
POST /auth/logout
Authorization: Bearer your_access_token
Content-Type: application/json

{
  "refreshToken": "your_refresh_token"
}
```

### User Endpoints

#### Get Profile
```
GET /users/profile
Authorization: Bearer your_access_token
```

#### Update Profile
```
PUT /users/profile
Authorization: Bearer your_access_token
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+1234567890",
  "bio": "User bio"
}
```

#### Upload Profile Picture
```
POST /users/profile/picture
Authorization: Bearer your_access_token
Content-Type: multipart/form-data

[file upload: profilePicture]
```

#### Get All Users (Admin)
```
GET /users?page=1&limit=10&search=john&role=user
Authorization: Bearer admin_access_token
```

#### Get User by ID
```
GET /users/:userId
Authorization: Bearer your_access_token
```

#### Update User (Admin)
```
PUT /users/:userId
Authorization: Bearer admin_access_token
Content-Type: application/json
```

#### Delete User (Admin)
```
DELETE /users/:userId
Authorization: Bearer admin_access_token
```

#### Update User Role (Admin)
```
PUT /users/:userId/role
Authorization: Bearer admin_access_token
Content-Type: application/json

{
  "role": "moderator"
}
```

### Message Endpoints

#### Send Message
```
POST /messages/send
Authorization: Bearer your_access_token
Content-Type: application/json

{
  "receiver": "user_id",
  "content": "Hello, how are you?",
  "attachments": []
}
```

#### Get Conversations
```
GET /messages/conversations?page=1&limit=10
Authorization: Bearer your_access_token
```

#### Get Messages with User
```
GET /messages/:userId?page=1&limit=20
Authorization: Bearer your_access_token
```

#### Update Message
```
PUT /messages/:messageId
Authorization: Bearer your_access_token
Content-Type: application/json

{
  "content": "Updated message content"
}
```

#### Delete Message
```
DELETE /messages/:messageId
Authorization: Bearer your_access_token
```

#### Mark Messages as Read
```
POST /messages/mark-as-read
Authorization: Bearer your_access_token
Content-Type: application/json

{
  "messageIds": ["message_id_1", "message_id_2"]
}
```

#### Get Unread Count
```
GET /messages/unread-count
Authorization: Bearer your_access_token
```

### Health Check
```
GET /health
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_access_token>
```

### Token Structure
- **Access Token**: 7 days expiry
- **Refresh Token**: 30 days expiry

## 🎮 Error Handling

All errors follow a standardized format:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error message",
  "data": null
}
```

### Common Status Codes
- `200`: OK
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `500`: Internal Server Error

## 📝 Validation

Request validation is done using Joi. Each endpoint has defined validation schemas to ensure data integrity.

## 🔒 Security Features

1. **Password Security**: Passwords are hashed with bcryptjs (salt rounds: 10)
2. **JWT Security**: Tokens are signed with a secret key
3. **CORS**: Configured to allow specific origins
4. **Rate Limiting**: Protects endpoints from abuse
5. **Input Validation**: All inputs are validated with Joi
6. **Error Handling**: Sensitive information is not exposed

## 🚀 Deployment

### Environment Setup
1. Set `NODE_ENV=production` in `.env`
2. Update `JWT_SECRET` with a strong random string
3. Configure MongoDB Atlas connection
4. Setup Cloudinary account and credentials
5. Configure email service credentials

### Deployment Options
- **Heroku**
- **AWS EC2**
- **DigitalOcean**
- **Azure**
- **Railway**

## 📦 Dependencies

See `package.json` for the complete list. Key dependencies:

| Package | Version | Purpose |
|---------|---------|---------|
| express | ^4.18.2 | Web framework |
| mongoose | ^8.0.0 | MongoDB ODM |
| jsonwebtoken | ^9.1.2 | JWT authentication |
| bcryptjs | ^2.4.3 | Password hashing |
| joi | ^17.11.0 | Data validation |
| cors | ^2.8.5 | CORS support |
| multer | ^1.4.5 | File upload |
| cloudinary | ^1.40.0 | Cloud storage |
| nodemailer | ^6.9.7 | Email service |

## 🛠️ Development

### Running Tests
```bash
npm test
```

### Code Style
The project follows standard JavaScript conventions and ES6+ syntax.

### Contributing
1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Create a pull request

## 📖 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT Documentation](https://jwt.io/)
- [Joi Documentation](https://joi.dev/)

## 📄 License

ISC License

## 👥 Author

Gait Recognition Backend

## 🤝 Support

For issues and questions, please contact the development team or open an issue in the repository.

---

**Happy coding! 🚀**
