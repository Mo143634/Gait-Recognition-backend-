# Migration Guide: Saraha → Gait Recognition Backend

This guide helps developers migrate from the old Saraha (anonymous messaging) backend to the new Gait Recognition Backend.

---

## ⚠️ Breaking Changes

### Removed Endpoints

The following endpoints from the Saraha system are **no longer available**:

```
❌ POST   /api/messages/sendMessage
❌ GET    /api/messages/getConversation/:conversationId
❌ GET    /api/messages/getMyConversations
❌ DELETE /api/messages/:messageId
❌ PATCH  /api/messages/:messageId
❌ POST   /api/messages/markAsRead
❌ GET    /api/users/profile
❌ PATCH  /api/users/updateProfile
```

If your frontend application uses any of these endpoints, you'll need to remove or refactor that functionality.

### Removed Models

The following MongoDB collections are **no longer used**:

```
❌ Message
❌ Conversation
```

These can be safely archived or deleted from your database.

---

## ✅ New Endpoints Available

### Authentication (Unchanged)
The authentication system remains largely the same:

```
✅ POST   /api/auth/signup        # Same as before
✅ POST   /api/auth/login         # Same as before
✅ GET    /api/auth/refresh-token # Same as before
✅ POST   /api/auth/logout        # Same as before
```

### New Gait Module
```
✅ POST   /api/gait/upload        # Upload gait video
✅ GET    /api/gait               # List user's gait profiles
✅ GET    /api/gait/:profileId    # Get single profile
✅ PATCH  /api/gait/:profileId    # Update profile metadata
✅ DELETE /api/gait/:profileId    # Delete profile
```

### New Analysis Module
```
✅ POST   /api/analysis/run                       # Run analysis
✅ GET    /api/analysis/:analysisId               # Get result
✅ GET    /api/analysis                           # List history
✅ GET    /api/analysis/profile/:profileId/history # Profile analysis
✅ GET    /api/analysis/stats/summary             # Get statistics
```

---

## 📋 Migration Checklist

### For Backend Developers

- [ ] Update API imports/URLs in your application from old message endpoints to new gait endpoints
- [ ] Remove any code that handles message conversations
- [ ] Remove any message-related UI components
- [ ] Update database indexes (remove old Message/Conversation collections)
- [ ] Update API documentation/Postman collections
- [ ] Test all authentication flows (should work unchanged)
- [ ] Implement new gait video upload feature
- [ ] Implement new analysis request feature
- [ ] Update user profile schema expectations (users now have `gaitProfiles` and `analysisHistory` arrays)
- [ ] Install new dependency: `npm install --save axios`

### For Frontend Developers

- [ ] Remove all message-related UI (compose, read, delete, etc.)
- [ ] Remove `/api/messages/*` API calls
- [ ] Remove `/api/users/*` API calls
- [ ] Implement gait video upload form
  - Accept video files (MP4, MPEG, AVI, MOV - max 500MB)
  - Show upload progress
  - Display uploaded video in user's profile
- [ ] Implement analysis request feature
  - Allow users to run analysis on their videos
  - Show analysis status (pending → processing → completed)
  - Display results when complete
- [ ] Implement analysis results viewer
  - Show biomechanical metrics
  - Display movement quality assessment
  - Show posture analysis
  - Display symmetry score
- [ ] Update user profile page
  - Show gait profiles instead of messages
  - Show analysis history
  - Add video player for uploaded videos
- [ ] Update authentication flows (should mostly work unchanged)

---

## 🔄 Data Migration

### User Model Changes

**Old User Model:**
```javascript
{
  _id: ObjectId,
  first_name: String,
  last_name: String,
  email: String,
  messages: [{ ref: "Message" }],  // ❌ REMOVED
  // ... other fields
}
```

**New User Model:**
```javascript
{
  _id: ObjectId,
  first_name: String,
  last_name: String,
  email: String,
  gaitProfiles: [{ ref: "GaitProfile" }],      // ✅ NEW
  analysisHistory: [{ ref: "GaitAnalysis" }],  // ✅ NEW
  // ... other fields (unchanged)
}
```

### Migration Query Example

If you want to see existing users in your new system:

```javascript
// This query works the same in both systems
const user = await UserModel.findById(userId)
  .populate('gaitProfiles')
  .populate('analysisHistory');
```

---

## 🎥 Feature Mapping

### Old Saraha Features → New Gait Features

| Old Feature | New Equivalent |
|------------|-----------------|
| Send Anonymous Message | Upload Gait Video |
| Receive Message | View Analysis Result |
| Message Conversation | Gait Analysis History |
| Mark Message as Read | Request Analysis |
| Delete Message | Delete Gait Profile |
| Archive Message | N/A (Delete instead) |

---

## 🚀 Quick Start with New Features

### 1. Upload a Gait Video
```javascript
const formData = new FormData();
formData.append('video', videoFile); // File object
formData.append('description', 'Morning walk gait analysis');

const response = await fetch('/api/gait/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});

const gaitProfile = await response.json();
const profileId = gaitProfile.data._id;
```

### 2. Run Analysis
```javascript
const response = await fetch('/api/analysis/run', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    gait_profile_id: profileId
  })
});

const analysis = await response.json();
const analysisId = analysis.data._id;
```

### 3. Check Analysis Status
```javascript
const response = await fetch(`/api/analysis/${analysisId}`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const result = await response.json();
console.log(result.data.status); // "pending" | "processing" | "completed" | "failed"
```

### 4. Get Analysis Results
```javascript
// Once status is "completed"
const response = await fetch(`/api/analysis/${analysisId}`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const result = await response.json();
console.log(result.data.result); // Contains biomechanical metrics, posture, etc.
console.log(result.data.confidence_score); // 0-100
```

---

## 🔧 Configuration Changes

### Environment Variables

Update your `.env` file with new variables:

```diff
- (No longer needed for messaging)
+ AI_API_URL=http://localhost:5000/api/analyze
+ CLOUD_NAME=your_cloudinary_cloud_name
+ API_KEY=your_cloudinary_api_key
+ API_SECRET=your_cloudinary_api_secret
```

### Database Changes

If you can, archive old collections:

```javascript
// Backup before deleting
db.messages.aggregate([{ $out: "messages_backup_2024" }])
db.conversations.aggregate([{ $out: "conversations_backup_2024" }])

// Then delete
db.messages.deleteMany({})
db.conversations.deleteMany({})
```

---

## 🧪 Testing Migration

### Test Checklist

1. **Authentication Still Works**
   ```bash
   POST /api/auth/login
   # Should return accessToken and refreshToken as before
   ```

2. **User Profile Loads**
   ```bash
   GET /api/auth/refresh-token with valid refresh token
   # Should return new access token
   ```

3. **New Gait Upload Works**
   ```bash
   POST /api/gait/upload with video file
   # Should return gaitProfile object with _id
   ```

4. **Analysis Can Be Requested**
   ```bash
   POST /api/analysis/run with valid profileId
   # Should return analysis object with status: "processing"
   ```

5. **History Endpoints Work**
   ```bash
   GET /api/analysis
   # Should return paginated analysis history
   ```

---

## ❓ FAQ

### Q: Will my old messages be deleted?
A: Not automatically. Old message data will remain in your database unless you explicitly delete it. However, the API endpoints are gone, so they won't be accessible through the backend.

### Q: Can I keep both messaging and gait recognition?
A: You would need to maintain a custom fork of the codebase or implement both modules side-by-side. The base system now only includes gait recognition.

### Q: How do I handle existing user sessions?
A: Existing JWT tokens will continue to work! The authentication system hasn't changed. Your users won't need to re-login.

### Q: What about my user profile pictures?
A: Profile picture storage hasn't changed - that functionality is preserved in the user model. Only message-related features have been removed.

### Q: How do I integrate the external AI API?
A: Configure `AI_API_URL` in your `.env` file to point to your AI service. The analysis module expects a POST endpoint that returns `{ result: {...}, confidence_score: number }`.

### Q: What video formats are supported?
A: MP4, MPEG, AVI, and MOV files up to 500MB each.

---

## 📞 Need Help?

- Review `API_DOCUMENTATION.md` for detailed endpoint documentation
- Check `REFACTORING_SUMMARY.md` for technical implementation details
- See `README.md` for project overview
- Refer to `.env.example` for all configuration options

---

## 🎬 Summary

The transition from Saraha to Gait Recognition is significant:
- ❌ Messaging system removed
- ✅ Gait video upload added
- ✅ AI-powered analysis added
- ✅ Authentication preserved
- ✅ User system preserved

Update your applications accordingly and test thoroughly before deploying to production.

**Happy migrating! 🚀**
