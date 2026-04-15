# Project Setup Instructions

## Prerequisites
- Node.js v14 or higher
- MongoDB (local or MongoDB Atlas)
- npm or yarn package manager

## Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Copy the `.env.example` file to `.env` and update with your credentials:

```bash
cp .env.example .env
```

Edit `.env` file with your configuration:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/gait-recognition

# Cloudinary
CLOUDINARY_CLOUD_NAME=xxxxx
CLOUDINARY_API_KEY=xxxxx
CLOUDINARY_API_SECRET=xxxxx

# Email Service (Gmail)
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# JWT
JWT_SECRET=your_random_secret_key
```

### 3. MongoDB Setup

**Option A: Local MongoDB**
```bash
# Install MongoDB Community Edition
# Start MongoDB service
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update MONGODB_URI in .env

### 4. Cloudinary Setup

1. Sign up at https://cloudinary.com/
2. Copy your Cloud Name, API Key, and API Secret
3. Update .env file

### 5. Email Service Setup (Gmail)

1. Enable 2-factor authentication on Gmail
2. Generate app-specific password
3. Use that password in SMTP_PASSWORD

## Running the Server

**Development Mode** (with hot reload):
```bash
npm run dev
```

**Production Mode**:
```bash
npm start
```

## API Endpoints

Server will run on: `http://localhost:5000`

### Health Check
```bash
curl http://localhost:5000/health
```

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "confirmPassword": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

## Project Structure Overview

```
├── src/
│   ├── config/          # Configuration files
│   ├── middleware/      # Express middleware
│   ├── modules/         # Business logic (auth, user, message)
│   ├── utils/           # Utility functions
│   └── index.js         # Entry point
├── uploads/             # File uploads directory
├── .env.example         # Environment template
├── package.json         # Dependencies
└── README.md           # Full documentation
```

## Module Architecture

Each module follows this structure:

```
module/
├── module.controller.js   # Request handlers
├── module.service.js      # Business logic
├── module.model.js        # Database schema
├── module.routes.js       # API routes
└── module.validation.js   # Input validation
```

## Testing the API

Use tools like:
- **Postman** (https://www.postman.com/)
- **Thunder Client** (VS Code extension)
- **REST Client** (VS Code extension)
- **curl** (command line)

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Verify firewall settings

### Cloudinary Errors
- Verify credentials in .env
- Check API limits

### Email Not Sending
- Enable less secure apps (deprecated)
- Use Gmail app-specific password
- Check SMTP settings

### Port Already in Use
Change PORT in .env to an available port

## Next Steps

1. ✅ Install dependencies
2. ✅ Configure .env
3. ✅ Start MongoDB
4. ✅ Run the server
5. ✅ Test API endpoints
6. ✅ Integrate with frontend

## Additional Resources

- Express.js: https://expressjs.com/
- MongoDB: https://docs.mongodb.com/
- Mongoose: https://mongoosejs.com/
- JWT: https://jwt.io/
- Joi Validation: https://joi.dev/

---

For detailed API documentation, see [README.md](./README.md)
