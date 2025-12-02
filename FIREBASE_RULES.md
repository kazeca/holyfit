# Firebase Storage Security Rules

These rules should be added to your Firebase Console under Storage → Rules.

## Storage Rules

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    
    // Challenge photos - users can only upload to their own folder
    match /challenges/{userId}/{photoId} {
      // Allow read for all authenticated users (for feed display)
      allow read: if request.auth != null;
      
      // Allow write only for the owner
      allow write: if request.auth != null 
                   && request.auth.uid == userId
                   && request.resource.size < 10 * 1024 * 1024  // Max 10MB
                   && request.resource.contentType.matches('image/.*');  // Images only
      
      // Prevent deletion (keep photo history)
      allow delete: if false;
    }
    
    // Default: deny all other access
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

## Firestore Security Rules (Additions)

Add these rules to your existing Firestore rules:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Existing rules...
    
    // Challenge completions - read all, write only own
    match /challenge_completions/{completionId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null 
                    && request.resource.data.userId == request.auth.uid;
      allow update, delete: if false;  // Immutable after creation
    }
    
    // Feed posts - read all, write only own
    match /feed_posts/{postId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null 
                    && request.resource.data.userId == request.auth.uid;
      allow update: if request.auth != null 
                    && resource.data.userId == request.auth.uid;  // For likes
      allow delete: if request.auth != null 
                    && resource.data.userId == request.auth.uid;
    }
  }
}
```

## How to Apply

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **holy-fit-f7242**
3. Navigate to **Storage** → **Rules** tab
4. Copy and paste the Storage rules above
5. Click **Publish**
6. Navigate to **Firestore Database** → **Rules** tab
7. Add the Firestore rules to your existing rules
8. Click **Publish**

## Testing Rules

After deploying, test that:
- ✅ Users can upload photos to `/challenges/{their_uid}/`
- ❌ Users cannot upload photos to other users' folders
- ✅ Users can read all challenge photos (for feed)
- ❌ Users cannot delete challenge photos
- ✅ File size limit (10MB) is enforced
- ✅ Only image files are accepted
