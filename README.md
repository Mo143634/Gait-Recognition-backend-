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

### Gait Recognition Features
- ✅ Upload gait video files (MP4, MPEG, AVI, MOV)
- ✅ Cloudinary cloud storage integration
- ✅ Video metadata tracking (duration, size, file info)
- ✅ Gait profile management (create, read, update, delete)
- ✅ User-scoped profile isolation
- ✅ Gait analysis request submission
- ✅ External AI API integration
- ✅ Analysis result storage with confidence scores
- ✅ Biomechanical metrics storage
- ✅ Analysis history tracking
- ✅ Real-time processing status
- ✅ Analysis statistics and aggregation

### File Management
- ✅ Multer file upload with validation
- ✅ Cloudinary video storage integration
- ✅ Automatic cleanup on deletion
- ✅ File size limits (up to 500MB for videos)

### API Features
- ✅ Comprehensive error handling
- ✅ Request validation with Joi
- ✅ Async/await pattern
- ✅ API response standardization
- ✅ Pagination support
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
- **HTTP Client**: Axios
- **CORS**: cors
- **Rate Limiting**: express-rate-limit
- **Development**: Nodemon

## 📁 Project Structure

```
gait-recognition-backend/
├── src/
│   ├── db/
│   │   ├── connection.js        # MongoDB connection
│   │   ├── dbService.js         # Database utilities
│   │   └── models/
│   │       ├── user.model.js    # User schema with gait profiles
│   │       └── token.model.js   # Token blacklist model
│   ├── middleware/
│   │   ├── authenticaion.middleware.js   # JWT authentication
│   │   └── validation.middleware.js      # Request validation
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.service.js
│   │   │   └── auth.validation.js
│   │   ├── gait/                [NEW]
│   │   │   ├── gait.controller.js
│   │   │   ├── gait.model.js
│   │   │   ├── gait.routes.js
│   │   │   ├── gait.service.js
│   │   │   └── gait.validation.js
│   │   └── analysis/            [NEW]
│   │       ├── analysis.model.js
│   │       ├── analysis.routes.js
│   │       ├── analysis.service.js
│   │       └── analysis.validation.js
│   ├── utils/
│   │   ├── cors/
│   │   │   └── cors.js
│   │   ├── cron/                # Scheduled tasks
│   │   ├── Email/               # Email utilities
│   │   ├── Encryption/          # Encryption utilities
│   │   ├── Event/               # Event emitters
│   │   ├── Hashing/             # Password hashing
│   │   ├── loggers/             # Logging utilities
│   │   ├── multer/              # File upload configuration
│   │   └── Token/               # JWT utilities
│   ├── app.controller.js        # Express app setup
│   └── index.js                 # Entry point
├── uploads/                      # File uploads directory
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies
├── README.md                    # Documentation
└── REFACTORING_SUMMARY.md       # Detailed refactoring changes
```

## 🚀 Getting Started

### Prerequisites
- Node.js >= 14.x
- MongoDB (local or Atlas)
- Cloudinary account
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
PORT=3000
MOOD=DEV

# Database
MONGODB_URI=mongodb://localhost:27017/gait-recognition

# JWT Signatures
ACCESS_USER_SIGNATURE_TOKEN=your_access_user_signature
REFRESH_USER_SIGNATURE_TOKEN=your_refresh_user_signature
ACCESS_ADMIN_SIGNATURE_TOKEN=your_access_admin_signature
REFRESH_ADMIN_SIGNATURE_TOKEN=your_refresh_admin_signature

# Email (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password

# Cloudinary
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret

# External AI API
AI_API_URL=http://localhost:5000/api/analyze
```

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
