# Quick Reference - Gait Recognition Backend

## 🚀 Installation & Setup

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Run development server
npm run dev

# Run production server
npm start
```

---

## 📌 Key Endpoints

### Gait Management
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/gait/upload` | Upload gait video |
| GET | `/api/gait` | List all profiles (paginated) |
| GET | `/api/gait/:profileId` | Get profile details |
| PATCH | `/api/gait/:profileId` | Update profile |
| DELETE | `/api/gait/:profileId` | Delete profile |

### Analysis
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/analysis/run` | Start analysis |
| GET | `/api/analysis/:analysisId` | Get analysis result |
| GET | `/api/analysis` | List analysis history |
| GET | `/api/analysis/profile/:profileId/history` | Profile's analyses |
| GET | `/api/analysis/stats/summary` | Statistics |

### Auth (Unchanged)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/signup` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/refresh-token` | Get new access token |
| POST | `/api/auth/logout` | Logout user |

---

## 📁 New Module Files

### Gait Module (`src/modules/gait/`)
- `gait.controller.js` - Routes and handlers
- `gait.model.js` - MongoDB schema
- `gait.service.js` - Business logic
- `gait.validation.js` - Input validation (Joi)
- `gait.routes.js` - Router export

### Analysis Module (`src/modules/analysis/`)
- `analysis.model.js` - MongoDB schema
- `analysis.routes.js` - Routes and handlers
- `analysis.service.js` - Business logic
- `analysis.validation.js` - Input validation (Joi)

---

## 🔑 Authentication

All requests (except auth) require:
```
Authorization: Bearer <access_token>
```

Get access token from login:
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}
```

---

## 📤 Upload Video

```bash
curl -X POST http://localhost:3000/api/gait/upload \
  -H "Authorization: Bearer <token>" \
  -F "video=@video.mp4" \
  -F "description=Test gait"
```

**Supported formats:** MP4, MPEG, AVI, MOV  
**Max size:** 500 MB

---

## 🔍 Request Analysis

```bash
POST /api/analysis/run
Authorization: Bearer <token>
Content-Type: application/json

{
  "gait_profile_id": "507f1f77bcf86cd799439012"
}
```

**Status flow:** pending → processing → completed/failed

---

## 📊 Get Analysis Results

```bash
GET /api/analysis/:analysisId
Authorization: Bearer <token>
```

**Response includes:**
- `status`: Current processing status
- `confidence_score`: Result accuracy (0-100)
- `result`: Biomechanical metrics, posture, symmetry
- `processing_time_ms`: How long analysis took

---

## ⚙️ Environment Setup

```env
# Server
PORT=3000
MOOD=DEV

# Database
MONGODB_URI=mongodb://localhost:27017/gait-recognition

# JWT Signatures
ACCESS_USER_SIGNATURE_TOKEN=your_secret_1
REFRESH_USER_SIGNATURE_TOKEN=your_secret_2
ACCESS_ADMIN_SIGNATURE_TOKEN=your_secret_3
REFRESH_ADMIN_SIGNATURE_TOKEN=your_secret_4

# Cloudinary (Video Storage)
CLOUD_NAME=your_cloud_name
API_KEY=your_api_key
API_SECRET=your_api_secret

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# AI Service
AI_API_URL=http://localhost:5000/api/analyze

# Rate Limiting
RATE_LIMIT_WINDOW=15m
RATE_LIMIT_MAX=100
```

---

## 🗄️ Database Models

### User
```javascript
{
  _id: ObjectId,
  first_name: String,
  last_name: String,
  email: String (unique),
  password: String (hashed),
  gaitProfiles: [ObjectId],        // NEW: Gait profiles
  analysisHistory: [ObjectId],     // NEW: Analysis results
  role: "USER" | "ADMIN",
  // ... other auth fields
}
```

### GaitProfile (NEW)
```javascript
{
  _id: ObjectId,
  user_id: ObjectId (ref: User),
  video_url: String (Cloudinary URL),
  file_name: String,
  file_size: Number,
  video_duration: Number,
  status: "pending" | "processing" | "completed" | "failed",
  description: String,
  metadata: { duration, codec, etc },
  createdAt: Date,
  updatedAt: Date
}
```

### GaitAnalysis (NEW)
```javascript
{
  _id: ObjectId,
  user_id: ObjectId (ref: User),
  gait_profile_id: ObjectId (ref: GaitProfile),
  status: "pending" | "processing" | "completed" | "failed",
  result: {
    biomechanical_metrics: { stride_length, cadence, etc },
    movement_analysis: { joint_angles, quality },
    posture_analysis: { spine, shoulders, head },
    symmetry_score: Number
  },
  confidence_score: Number (0-100),
  processing_time_ms: Number,
  requested_at: Date,
  completed_at: Date
}
```

---

## 🔄 Common Workflows

### 1. User Signup & Login
```
POST /api/auth/signup → Create account
POST /api/auth/login → Get access token
```

### 2. Upload & Analyze
```
POST /api/gait/upload → Get profileId
POST /api/analysis/run → Get analysisId
GET /api/analysis/:analysisId → Get results (check status)
```

### 3. View History
```
GET /api/analysis → All analyses
GET /api/gait → All videos
GET /api/analysis/profile/:profileId/history → Profile's analyses
```

---

## 🛠️ Development Tips

### Enable Debug Logging
```javascript
// In service files
console.log("Debug info:", variable);
```

### Test Endpoints
Use Postman or cURL. Example collection structure:
```
Gait Recognition
├── Auth
│   ├── Signup
│   ├── Login
│   └── Refresh Token
├── Gait
│   ├── Upload Video
│   ├── List Videos
│   └── Delete Video
└── Analysis
    ├── Run Analysis
    ├── Get Result
    └── List History
```

### Monitor Processing
```bash
# Watch analysis status
while true; do
  curl -H "Authorization: Bearer $TOKEN" \
    "http://localhost:3000/api/analysis/$ANALYSIS_ID"
  sleep 2
done
```

---

## ⚠️ Common Issues

### Issue: Video upload fails
- [ ] File format supported? (MP4, MPEG, AVI, MOV)
- [ ] File size < 500MB?
- [ ] Cloudinary credentials correct?
- [ ] User authenticated?

### Issue: Analysis stuck on "processing"
- [ ] Is AI API running? (check `AI_API_URL`)
- [ ] API responding with valid data?
- [ ] Check logs for API errors

### Issue: "Invalid Token"
- [ ] Token in `Authorization: Bearer <token>` format?
- [ ] Token expired? Use `/api/auth/refresh-token`
- [ ] Correct signature configured in `.env`?

### Issue: 429 Too Many Requests
- [ ] Rate limit exceeded (100 per 15 min)
- [ ] Wait before retrying
- [ ] Or adjust `RATE_LIMIT_MAX` in `.env`

---

## 📚 Documentation

- `README.md` - Project overview
- `API_DOCUMENTATION.md` - Full endpoint documentation
- `REFACTORING_SUMMARY.md` - What changed from old system
- `MIGRATION_GUIDE.md` - Migrating from Saraha
- `.env.example` - Configuration template

---

## 🧪 Testing Checklist

- [ ] Server starts without errors (`npm run dev`)
- [ ] Auth endpoints work (signup, login)
- [ ] Can upload video file
- [ ] Video stored in Cloudinary
- [ ] Can request analysis
- [ ] Can retrieve analysis results
- [ ] Pagination works on list endpoints
- [ ] Rate limiting active (test with multiple requests)
- [ ] Error handling returns proper status codes

---

## 📞 Troubleshooting

Check logs:
```bash
tail -f /path/to/logs/authLogs.log
tail -f /path/to/logs/gaitLogs.log
tail -f /path/to/logs/analysisLogs.log
```

Verify environment:
```bash
# Check Node version
node --version

# Check installed packages
npm list | grep -E "express|mongoose|cloudinary"

# Test MongoDB connection
mongosh "mongodb://localhost:27017/gait-recognition"
```

---

**Last Updated:** January 2024  
**Version:** 1.0.0  
**Production Ready:** ✅
