# Gait Recognition Backend - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All endpoints except auth routes require a valid JWT token in the `Authorization` header:
```
Authorization: Bearer <access_token>
```


---

## 📊 Dashboard Endpoints

### 1. Stats Cards
Provides key metrics for the dashboard cards.

*   **All Stats**: `GET /api/dashboard/stats`

**Response Example (200):**
```json
{
  "success": true,
  "data": {
    "totalSubjects": 124,
    "processedVideos": 487,
    "accuracy": 95.2,
    "activeSessions": 8
  },
  "error": null
}
```

### 2. Recognition Accuracy Chart
Provides time-series data for the accuracy chart.

**URL**: `GET /api/dashboard/accuracy-chart`

**Response Example (200):**
```json
{
  "success": true,
  "data": [
    { "time": "00:00", "accuracy": 93 },
    { "time": "04:00", "accuracy": 94 },
    { "time": "08:00", "accuracy": 96 },
    { "time": "12:00", "accuracy": 95 },
    { "time": "16:00", "accuracy": 96 },
    { "time": "20:00", "accuracy": 95 }
  ],
  "error": null
}
```

### 3. System Status
Check the real-time health of services.

**URL**: `GET /api/dashboard/system-status`

**Response Example (200):**
```json
{
  "success": true,
  "data": {
    "modelInference": "online",
    "geiGenerator": "online",
    "featureExtractor": "online",
    "database": "online",
    "lastSync": "2 minutes ago"
  },
  "error": null
}
```

### 4. Recent Uploads Table
Retrieves the most recent video uploads and their analysis status.

**URL**: `GET /api/dashboard/recent-uploads`

**Response Example (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "VID-001",
      "filename": "cam_04_subject_082.avi",
      "subject": "Subject #082",
      "status": "identified",
      "score": 0.94,
      "time": "2 min ago"
    }
  ],
  "error": null
}
```

**Status Values:**
*   `identified`: Successfully processed and recognized.
*   `processing`: Currently being analyzed.
*   `failed`: Analysis failed or error occurred.

---

## 📈 Reports & Analytics Endpoints

### 1. Get Analytics Summary
Returns high-level performance metrics of the gait recognition system.

**URL**: `GET /api/reports/summary`
**Auth**: Required (Any role)

**Response Example (200):**
```json
{
  "success": true,
  "data": {
    "rank1Accuracy": 95.2,
    "rank5Accuracy": 99.1,
    "datasetSize": 1240,
    "modelParameters": "24.3M"
  },
  "error": null
}
```

### 2. Accuracy by Condition
Returns accuracy percentages for different gait conditions (Normal, Bag, Coat).

**URL**: `GET /api/reports/accuracy-by-condition?from=2024-01-01&to=2024-02-01`
**Auth**: Required

**Query Parameters:**
- `from` (optional): Start date
- `to` (optional): End date

**Response Example (200):**
```json
{
  "success": true,
  "data": [
    { "condition": "normal", "accuracy": 95 },
    { "condition": "bag", "accuracy": 91 },
    { "condition": "coat", "accuracy": 87 }
  ],
  "error": null
}
```

### 3. Dataset Distribution
Returns the percentage breakdown of sequences per condition in the dataset.

**URL**: `GET /api/reports/dataset-distribution?from=2024-01-01&to=2024-02-01`
**Auth**: Required

**Query Parameters:**
- `from` (optional): Start date
- `to` (optional): End date

**Response Example (200):**
```json
{
  "success": true,
  "data": [
    { "condition": "normal", "percentage": 40 },
    { "condition": "bag", "percentage": 35 },
    { "condition": "coat", "percentage": 25 }
  ],
  "error": null
}
```

### 4. Export Reports
Combines all analytics data into a single exportable JSON object.

**URL**: `GET /api/reports/export?from=2024-01-01&to=2024-02-01`
**Auth**: Required

**Query Parameters:**
- `from` (optional): Start date
- `to` (optional): End date

**Response Example (200):**
```json
{
  "success": true,
  "data": {
    "summary": { ... },
    "accuracyByCondition": [ ... ],
    "datasetDistribution": [ ... ]
  },
  "error": null
}
```

---

## ⚙️ Settings Endpoints

### 1. Get User Profile Settings
Retrieves personal and institutional information for the logged-in user.

**URL**: `GET /api/settings/profile`
**Auth**: Required

**Response Example (200):**
```json
{
  "success": true,
  "data": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "USER",
    "institution": "University of Research"
  },
  "error": null
}
```

### 2. Update User Profile Settings
Updates non-sensitive profile information. Note: Email and Role cannot be changed here.

**URL**: `PATCH /api/settings/profile`
**Auth**: Required
**Body**:
```json
{
  "fullName": "John Doe Updated",
  "institution": "Advanced Robotics Lab"
}
```

**Response Example (200):**
```json
{
  "success": true,
  "data": {
    "fullName": "John Doe Updated",
    "email": "john@example.com",
    "role": "USER",
    "institution": "Advanced Robotics Lab"
  },
  "error": null
}
```

### 3. Get Model Configurations
Retrieves current AI model inference settings.

**URL**: `GET /api/settings/model`
**Auth**: Required

**Response Example (200):**
```json
{
  "success": true,
  "data": {
    "similarityThreshold": 0.75,
    "frameSamplingRate": 30
  },
  "error": null
}
```

### 4. Update Model Configurations
Updates core inference parameters. **Restricted to Admin only.**

**URL**: `PATCH /api/settings/model`
**Auth**: Required (Role: ADMIN)
**Body**:
```json
{
  "similarityThreshold": 0.85,
  "frameSamplingRate": 60
}
```

**Constraints:**
*   `similarityThreshold`: Number between 0 and 1.
*   `frameSamplingRate`: Positive integer.

**Response Example (200):**
```json
{
  "success": true,
  "data": {
    "similarityThreshold": 0.85,
    "frameSamplingRate": 60
  },
  "error": null
}
```

---


## 📌 Authentication Endpoints

### 1. User Signup
```http
POST /auth/signup
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "confirmPassword": "SecurePassword123!",
  "gender": "male",
  "phone": "+1234567890"
}
```

**Notes:**
- A new user is assigned the `USER` role by default. Admins can update roles via the User Profile endpoint.

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": "John Doe",
    "email": "john@example.com",
    "gender": "male",
    "phone": "+1234567890",
    "role": "USER",
    "message": "Please check your Gmail inbox for the 6-digit verification code."
  },
  "error": null
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
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "fullName": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "role": "USER"
    }
  },
  "error": null
}
```

### 3. User Logout
```http
POST /auth/logout
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "flag": "single" 
}
```

**Logout Flags:**
- `logout` - Logout from current device (default)
- `allDevices` - Logout from all devices (invalidates all current sessions)

**Response (200/201):**
```json
{
  "message": "Logout successfully"
}
```


### 4. Social Login (Gmail)
```http
POST /auth/social-login
Content-Type: application/json

{
  "idToken": "google-id-token-here"
}
```

**Response (200/201):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  },
  "error": null
}
```

**Error (409 Conflict):**
- Occurs if the email is already registered using a different provider (e.g., SYSTEM).
```json
{
  "success": false,
  "data": null,
  "error": "Email already registered with another provider"
}
```

### 5. Refresh Token
```http
GET /auth/refresh-token
Authorization: Bearer <refresh_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  },
  "error": null
}
```

### 6. Confirm Email
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

### 7. Resend Email OTP
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

### 8. Forget Password
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

### 9. Resend Forgot Password OTP
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

### 10. Reset Password
```http
PATCH /auth/reset-password
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456",
  "password": "NewPassword123!",
  "confirmPassword": "NewPassword123!"
}
```

**Response (200):**
```json
{
  "message": "Password Reset Successfully"
}
```

---

## 👤 User Profile Endpoints

### 1. Get User Profile
```http
GET /user/profile
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": "John Doe",
    "email": "john@example.com",
    "gender": "male",
    "phone": "+1234567890",
    "role": "USER",
    "profile_Image": "https://res.cloudinary.com/..."
  },
  "error": null
}
```

### 2. Update User Profile
```http
PATCH /user
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

fullName: "John Updated"
gender: "male"
phone: "+1987654321"
image: <new_profile_image_file> (Optional)
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": "John Updated",
    "email": "john@example.com",
    "gender": "male",
    "phone": "+1987654321",
    "role": "USER",
    "profile_Image": "https://res.cloudinary.com/..."
  },
  "error": null
}
```

---

## 🎬 Gait Module Endpoints

### 1. Upload Gait Video
```http
POST /gait/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

video: <video_file> (MP4, MPEG, AVI, MOV - max 500MB)
description: "Optional description of the gait video"
```

**Response (201):**
```json
{
  "success": true,
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
  },
  "error": null
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
  "success": true,
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
  },
  "error": null
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
  "success": true,
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
  },
  "error": null
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
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "description": "Updated description"
  },
  "error": null
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
  "success": true,
  "data": {},
  "error": null
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
Note: The analysis may be returned as `completed`, `processing`, or `failed` depending on the AI service response.

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "user_id": "507f1f77bcf86cd799439011",
    "gait_profile_id": "507f1f77bcf86cd799439012",
    "status": "processing",
    "confidence_score": 0,
    "requested_at": "2024-01-15T10:35:00.000Z",
    "completed_at": null,
    "processing_time_ms": 150
  },
  "error": null
}
```

**Status Values:**
- `pending`: Initial state.
- `processing`: Analysis is currently being handled by the AI service (often returned when the service is async).
- `completed`: Analysis finished successfully.
- `failed`: Analysis failed (check `error_message` in the data object).

### 2. Get Analysis Result
```http
GET /analysis/:analysisId
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
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
  },
  "error": null
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
  "success": true,
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
  },
  "error": null
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
  "success": true,
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
  },
  "error": null
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
  "success": true,
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
  },
  "error": null
}
```

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "data": null,
  "error": "Invalid gait profile ID format"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "data": null,
  "error": "Invalid Token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "data": null,
  "error": "You Don't Have Access To This Route"
}
```

### 404 Not Found
```json
{
  "success": false,
  "data": null,
  "error": "Gait profile not found"
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "data": null,
  "error": "Too many requests from this IP, please try again"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "data": null,
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
curl -X POST http://localhost:5000/api/gait/upload \
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

## ⚙️ Environment Configuration

To ensure all features work correctly, the following environment variables are required in your `.env` file:

### Email Setup (OTP)
Used for sending verification codes via Gmail.
- `EMAIL`: Your Gmail address (e.g., `user@gmail.com`).
- `APP_PASSWORD`: Your **Gmail App Password** (Generated in Google Account settings).

### Storage Setup
Used for gait video uploads and profile pictures.
- `UPLOAD_PATH`: Path to the local uploads directory (default: `uploads`).
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: Cloudinary credentials for cloud media storage.

### Security & JWT
Required for token generation and data encryption.
- `ACCESS_TOKEN_SIGNATURE`, `REFRESH_TOKEN_SIGNATURE`: Secret keys for signing JWTs.
- `SALT`: Number of rounds for password hashing (e.g., `10`).
- `ENCRYPTION_KEY`: A secret key for AES phone number encryption.

### System Configuration
- `PORT`: Server listening port (default: `5000`).
- `MONGODB_URI`: Connection string for MongoDB.
- `CORS_ORIGIN`: Allowed origins (comma-separated, e.g., `http://localhost:3000`).
- `AI_API_URL`: URL of the gait analysis AI service.

---

## 📞 Support

For issues or questions, refer to:
- `REFACTORING_SUMMARY.md` - Detailed changes from previous system
- `README.md` - Project overview
- `.env.example` - Configuration guide
