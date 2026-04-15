# Gait Recognition Backend - API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
All endpoints except auth routes require a valid JWT token in the `Authorization` header:
```
Authorization: Bearer <access_token>
```

---

## 📌 Authentication Endpoints

### 1. User Signup
```http
POST /auth/signup
Content-Type: application/json

{
  "fullname": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "gender": "male",
  "phone": "+1234567890",
  "role": "USER"
}
```

**Available Roles:**
- `USER` - Regular user (default)
- `ADMIN` - Administrator
- `RESEARCHER` - Researcher
- `SECURITY_OFFICER` - Security Officer

**Response (201):**
```json
{
  "message": "User Created Successfuly",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "fullname": "John Doe",
    "email": "john@example.com",
    "confirm_email": false
  }
}
```

### 2. User Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": { /* user object */ }
  }
}
```

### 3. Refresh Token
```http
GET /auth/refresh-token
Authorization: Bearer <refresh_token>
```

**Response (200):**
```json
{
  "message": "Token refreshed",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### 4. Confirm Email
```http
PATCH /auth/confirm-email
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response (200):**
```json
{
  "message": "Email confirmed successfully"
}
```

### 5. Resend Email OTP
```http
POST /auth/resend-email-otp
Content-Type: application/json

{
  "email": "john@example.com"
}
```

**Response (200):**
```json
{
  "message": "OTP resent to your email successfully"
}
```

### 6. Forget Password
```http
PATCH /auth/forget-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

**Response (200):**
```json
{
  "message": "OTP sent to your email successfully"
}
```

### 7. Resend Forgot Password OTP
```http
POST /auth/resend-forgot-password-otp
Content-Type: application/json

{
  "email": "john@example.com"
}
```

**Response (200):**
```json
{
  "message": "OTP resent to your email successfully"
}
```

### 8. Reset Password
```http
PATCH /auth/reset-password
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456",
  "password": "NewPassword123!",
  "confirm_password": "NewPassword123!"
}
```

**Response (200):**
```json
{
  "message": "Password Reset Successfully"
}
```

---

## 🎬 Gait Module Endpoints

### 1. Upload Gait Video
```http
POST /gait/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <video_file> (MP4, MPEG, AVI, MOV - max 500MB)
description: "Optional description of the gait video"
```

**Response (201):**
```json
{
  "message": "Gait video uploaded successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "user_id": "507f1f77bcf86cd799439011",
    "video_url": "https://res.cloudinary.com/.../video.mp4",
    "video_public_id": "gait-recognition/videos/507f1f77bcf86cd799439011/1234567890_john",
    "file_name": "gait_sample.mp4",
    "file_size": 512000,
    "video_duration": 30,
    "description": "Optional description",
    "status": "pending",
    "upload_date": "2024-01-15T10:30:00.000Z",
    "metadata": {
      "duration": 30
    }
  }
}
```

### 2. List Gait Profiles
```http
GET /gait?page=1&limit=10
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Gait profiles retrieved successfully",
  "data": {
    "profiles": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "user_id": "507f1f77bcf86cd799439011",
        "video_url": "https://res.cloudinary.com/.../video.mp4",
        "file_name": "gait_sample.mp4",
        "status": "pending",
        "upload_date": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 1,
      "total_records": 1,
      "limit": 10
    }
  }
}
```

### 3. Get Single Gait Profile
```http
GET /gait/:profileId
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Gait profile retrieved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "user_id": "507f1f77bcf86cd799439011",
    "video_url": "https://res.cloudinary.com/.../video.mp4",
    "file_name": "gait_sample.mp4",
    "file_size": 512000,
    "video_duration": 30,
    "status": "pending",
    "upload_date": "2024-01-15T10:30:00.000Z",
    "last_analyzed_at": null
  }
}
```

### 4. Update Gait Profile
```http
PATCH /gait/:profileId
Authorization: Bearer <token>
Content-Type: application/json

{
  "description": "Updated description"
}
```

**Response (200):**
```json
{
  "message": "Gait profile updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "description": "Updated description"
  }
}
```

### 5. Delete Gait Profile
```http
DELETE /gait/:profileId
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Gait profile deleted successfully",
  "data": {}
}
```

---

## 📊 Analysis Module Endpoints

### 1. Run Analysis on Gait Video
Submits a gait video for analysis by the external AI API.

```http
POST /analysis/run
Authorization: Bearer <token>
Content-Type: application/json

{
  "gait_profile_id": "507f1f77bcf86cd799439012"
}
```

**Response (201):**
```json
{
  "message": "Analysis request submitted successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "user_id": "507f1f77bcf86cd799439011",
    "gait_profile_id": "507f1f77bcf86cd799439012",
    "status": "processing",
    "confidence_score": null,
    "requested_at": "2024-01-15T10:35:00.000Z",
    "completed_at": null,
    "processing_time_ms": 150
  }
}
```

### 2. Get Analysis Result
```http
GET /analysis/:analysisId
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Analysis result retrieved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "user_id": "507f1f77bcf86cd799439011",
    "gait_profile_id": {
      "_id": "507f1f77bcf86cd799439012",
      "file_name": "gait_sample.mp4"
    },
    "status": "completed",
    "result": {
      "gait_pattern": "Normal",
      "biomechanical_metrics": {
        "stride_length": 1.42,
        "stride_width": 0.15,
        "step_time": 0.52,
        "gait_speed": 1.38,
        "cadence": 115
      },
      "movement_analysis": {
        "joint_angles": {
          "hip": 45,
          "knee": 165,
          "ankle": 10
        },
        "movement_quality": "Excellent"
      },
      "posture_analysis": {
        "spine_alignment": "Good",
        "shoulder_alignment": "Level",
        "head_position": "Neutral"
      },
      "symmetry_score": 92
    },
    "confidence_score": 95,
    "requested_at": "2024-01-15T10:35:00.000Z",
    "completed_at": "2024-01-15T10:40:00.000Z",
    "processing_time_ms": 300000
  }
}
```

### 3. List Analysis History
```http
GET /analysis?page=1&limit=10&status=completed
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number, default 1
- `limit` (optional): Records per page, default 10
- `status` (optional): Filter by status (pending, processing, completed, failed)

**Response (200):**
```json
{
  "message": "Analysis history retrieved successfully",
  "data": {
    "analyses": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "gait_profile_id": {
          "_id": "507f1f77bcf86cd799439012",
          "file_name": "gait_sample.mp4"
        },
        "status": "completed",
        "confidence_score": 95,
        "requested_at": "2024-01-15T10:35:00.000Z",
        "completed_at": "2024-01-15T10:40:00.000Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 1,
      "total_records": 1,
      "limit": 10
    }
  }
}
```

### 4. Get Profile Analysis History
```http
GET /analysis/profile/:profileId/history?page=1&limit=10
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Profile analysis history retrieved successfully",
  "data": {
    "gait_profile_id": "507f1f77bcf86cd799439012",
    "analyses": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "status": "completed",
        "confidence_score": 95,
        "requested_at": "2024-01-15T10:35:00.000Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 1,
      "total_records": 1,
      "limit": 10
    }
  }
}
```

### 5. Get Analysis Statistics
```http
GET /analysis/stats/summary
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Analysis statistics retrieved successfully",
  "data": {
    "status_breakdown": [
      {
        "_id": "completed",
        "count": 5,
        "avg_confidence": 94.2
      },
      {
        "_id": "pending",
        "count": 2,
        "avg_confidence": null
      }
    ],
    "processing_stats": {
      "total_time": 1500000,
      "avg_time": 300000
    }
  }
}
```

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "message": "Something went wrong",
  "error": "Invalid gait profile ID format"
}
```

### 401 Unauthorized
```json
{
  "message": "Something went wrong",
  "error": "Invalid Token"
}
```

### 403 Forbidden
```json
{
  "message": "Something went wrong",
  "error": "You Don't Have Access To This Route"
}
```

### 404 Not Found
```json
{
  "message": "Something went wrong",
  "error": "Gait profile not found"
}
```

### 429 Too Many Requests
```json
{
  "status": 429,
  "message": "Too many requests from this IP, please try again"
}
```

### 500 Internal Server Error
```json
{
  "message": "Something went wrong",
  "error": "Database connection failed"
}
```

---

## 📝 File Upload Requirements

### Video Files
- **Formats:** MP4, MPEG, AVI, MOV
- **Max Size:** 500 MB
- **Required Field Name:** `video`
- **Optional Fields:** `description`

### Example cURL Upload
```bash
curl -X POST http://localhost:3000/api/gait/upload \
  -H "Authorization: Bearer <token>" \
  -F "video=@path/to/video.mp4" \
  -F "description=My gait video"
```

---

## 🔐 Security Features

- JWT authentication on protected routes
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Password hashing with bcryptjs
- Cloudinary signed URLs for video access
- User-scoped data isolation
- Helmet security headers
- Input validation with Joi

---

## 🚀 Example Workflow

1. **Register/Login** → Get JWT token
2. **Upload Video** → POST /gait/upload → Get profile ID
3. **Run Analysis** → POST /analysis/run with profile ID
4. **Check Status** → GET /analysis/:analysisId (may be processing)
5. **Get Results** → GET /analysis/:analysisId (when completed)
6. **View History** → GET /analysis or GET /analysis/stats/summary

---

## 📞 Support

For issues or questions, refer to:
- `REFACTORING_SUMMARY.md` - Detailed changes from previous system
- `README.md` - Project overview
- `.env.example` - Configuration guide
