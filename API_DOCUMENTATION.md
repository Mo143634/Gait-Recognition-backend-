# Gait Recognition Backend - API Documentation

## 📍 Base URL
```
http://localhost:5000/api
```

## 🔐 Authentication & Access
All protected endpoints require a valid JWT token in the `Authorization` header:
```http
Authorization: Bearer <access_token>
```

---

## 📌 1. Authentication Endpoints

### 1.1 User Signup
Registers a new user account.
**URL**: `POST /auth/signup`
**Body**:
```json
{
  "fullname": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "confirm_password": "SecurePassword123!",
  "gender": "male",
  "phone": "+1234567890",
  "role": "USER"
}
```

**Available Roles**: `USER`, `ADMIN`, `RESEARCHER`, `SECURITY_OFFICER`

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "fullname": "John Doe",
    "email": "john@example.com",
    "gender": "male",
    "phone": "+1234567890",
    "role": "USER",
    "message": "Please check your Gmail inbox for the 6-digit verification code."
  },
  "error": null
}
```

### 1.2 User Login
**URL**: `POST /auth/login`
**Body**:
```json
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
      "fullname": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "role": "USER"
    }
  },
  "error": null
}
```

### 1.3 Social Login (Gmail)
**URL**: `POST /auth/social-login`
**Body**:
```json
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

### 1.4 User Logout
**URL**: `POST /auth/logout`
**Body**:
```json
{
  "flag": "single" | "allDevices"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": null,
  "error": null
}
```

### 1.5 Account Recovery & Verification
*   **Confirm Email**: `PATCH /auth/confirm-email` (Body: `email`, `otp`)
*   **Forget Password**: `PATCH /auth/forget-password` (Body: `email`)
*   **Reset Password**: `PATCH /auth/reset-password` (Body: `email`, `otp`, `password`, `confirm_password`)
*   **Resend OTP**: `POST /auth/resend-email-otp` or `POST /auth/resend-forgot-password-otp`

---

## 👤 2. User Profile Endpoints

### 2.1 Get User Profile
**URL**: `GET /user/profile`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "fullname": "John Doe",
    "email": "john@example.com",
    "gender": "male",
    "phone": "+1234567890",
    "role": "USER",
    "profile_Image": "https://res.cloudinary.com/...",
    "institution": "University of Research"
  },
  "error": null
}
```

### 2.2 Update User Profile
**URL**: `PATCH /user`
**Type**: `multipart/form-data`

**Fields**: `fullname`, `gender`, `phone`, `image` (Optional file)

---

## 📊 3. Dashboard Endpoints

### 3.1 Statistics Summary
**URL**: `GET /api/dashboard/stats` (Single call for all)
**Response (200):**
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

### 3.2 Recognition Accuracy Chart
**URL**: `GET /api/dashboard/accuracy-chart`
*Returns time-series data for the dashboard line chart.*

### 3.3 Recent Uploads
**URL**: `GET /api/dashboard/recent-uploads`
*Returns the last 5 uploads with their analysis status.*

---

## 🎬 4. Gait Module Endpoints

### 4.1 Upload Gait Video
**URL**: `POST /gait/upload`
**Type**: `multipart/form-data`

**Fields**:
*   `video`: File (MP4, AVI, MOV - Max 500MB)
*   `condition`: "normal" | "bag" | "coat"
*   `description`: Optional text

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "condition": "normal",
    "video_url": "https://res.cloudinary.com/...",
    "status": "pending"
  },
  "error": null
}
```

### 4.2 Gait Management
*   **List Profiles**: `GET /gait?page=1&limit=10`
*   **Get Single**: `GET /gait/:profileId`
*   **Update**: `PATCH /gait/:profileId` (Body: `description`)
*   **Delete**: `DELETE /gait/:profileId`

---

## 🔬 5. Analysis Module Endpoints

### 5.1 Run Analysis
**URL**: `POST /analysis/run`
**Body**: `{ "gait_profile_id": "ID" }`

### 5.2 Get Analysis Result
**URL**: `GET /analysis/:analysisId`
**Response (200):**
```json
{
  "success": true,
  "data": {
    "status": "completed",
    "confidence_score": 95,
    "result": {
      "gait_pattern": "Normal",
      "biomechanical_metrics": { ... },
      "symmetry_score": 92
    }
  },
  "error": null
}
```

---

## 📈 6. Reports & Analytics Endpoints

### 6.1 Accuracy by Condition
**URL**: `GET /api/reports/accuracy-by-condition`
**Response**: Breakdown for `normal`, `bag`, and `coat`.

### 6.2 Dataset Distribution
**URL**: `GET /api/reports/dataset-distribution`
**Response**: Percentage split of uploaded sequences.

---

## ⚙️ 7. Settings Endpoints

### 7.1 Profile Settings
Manage name and institution: `GET /api/settings/profile` and `PATCH /api/settings/profile`.

### 7.2 Model Configuration (ADMIN ONLY)
Manage threshold and sampling: `GET /api/settings/model` and `PATCH /api/settings/model`.

---

## ❌ Global Error Responses
All errors follow the standard format:
```json
{
  "success": false,
  "data": null,
  "error": "Detailed error message here"
}
```

---

## 🚀 Recommended Workflow
1.  **Onboard**: `Signup` -> `Confirm Email` -> `Login`.
2.  **Dataset Preparation**: `Upload Video` with condition (`normal`/`bag`/`coat`).
3.  **Inference**: Analysis starts automatically (or call `POST /analysis/run`).
4.  **Visualize**: Check `Dashboard` for overview and `Reports` for deep analytics.
5.  **Configure**: Admin adjusts `Settings` (Sampling Rate, etc.) to optimize AI performance.
