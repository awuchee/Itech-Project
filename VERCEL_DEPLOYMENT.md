# 🚀 Vercel Deployment & Database Schema Guidelines

This document details how to deploy the **Global Opportunities Hub (Next.js React)** web application to Vercel, link it with your Firestore/Firebase Authentication suite, and configure matching security rules.

---

## 1. Firebase Suite Configuration

Since the Next.js application shares the Firestore collections with the Android Kotlin companion, register a web counterpart in your Firebase console:

1. Head to the [Firebase Developer Portal](https://console.firebase.google.com/) and open project: `global-opportunities-hub-9b67b`.
2. Click **Add App** and select **Web** (`</>`).
3. Name your app (e.g., `Global Hub Web`) and register it.
4. Secure your config variables shown during setup.

---

## 2. Shared Firestore Database Schema

The web and mobile apps synchronize across the following Firestore collections:

### A. `/users` (User Profiles)
* Document ID: `email` (string)
* Schema:
```json
{
  "email": "user@example.com",
  "fullName": "Elizabeth Vance",
  "role": "CANDIDATE", // Mappings: "CANDIDATE" | "RECRUITER" | "ADMIN"
  "phone": "+1234567890",
  "education": "MSc. Cyber Security, TUM",
  "experience": "2+ years research engineer",
  "skills": "Rust, Linux Kernel, Python",
  "cvText": "Candidate raw CV text buffer details here...",
  "preferredCountry": "Germany",
  "preferredCategory": "Scholarships",
  "noIeltsChecked": true,
  "visaSponsorshipNeeded": true,
  "remoteOnly": false
}
```

### B. `/opportunities` (Postings Registry)
* Document ID: Generated auto ID (or pre-seeded IDs like `1`, `2`, `3`)
* Schema:
```json
{
  "title": "Gates Cambridge Scholarship",
  "organization": "Bill & Melinda Gate Foundation",
  "country": "United Kingdom",
  "category": "Scholarships",
  "deadline": "2026-10-15",
  "fundingAmount": "£18,000 stipend + full tuition",
  "isFullyFunded": true,
  "eligibility": "Postgraduate applicants outside UK...",
  "description": "Prestigious post-grad award for international selectees...",
  "benefits": "Tuition fees, travel allowance, maintenance allowance...",
  "officialLink": "https://www.gatescambridge.org",
  "datePosted": "2026-06-05",
  "status": "APPROVED", // Mappings: "PENDING" | "APPROVED" | "REJECTED"
  "visaSponsorship": true,
  "remote": false,
  "noIeltsRequired": false,
  "govtSponsored": true,
  "rating": 4.8,
  "creatorEmail": "richardprempe@gmail.com"
}
```

### C. `/applications` (Submission Records)
* Document ID: Generated ID
* Schema:
```json
{
  "userId": "user@example.com",
  "opportunityId": "opp_123456",
  "opportunityTitle": "Gates Cambridge Scholarship",
  "organization": "Bill & Melinda Gate Foundation",
  "status": "Applied", // Mappings: "Applied" | "In Review" | "Interview" | "Offer" | "Closed"
  "appliedDate": "2026-06-09",
  "notes": "Eager developer hoping to secure this slot."
}
```

---

## 3. Recommended Firebase Security Rules

For Firestore, write these rules in your Firebase Console **Rules panel** to partition RBAC permissions securely:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // User profile matching rules
    match /users/{email} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.email == email;
    }
    
    // Position listings matching rules
    match /opportunities/{oppId} {
      allow read: if true; // Public listings visibility
      allow create, update: if request.auth != null; // Registered credentials required
      allow delete: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.token.email)).data.role == "ADMIN";
    }
    
    // Application timelines tracking rules
    match /applications/{appId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 4. One-Click Vercel Deployment Steps

Deploying your newly consolidated fullstack Next.js app takes under two minutes:

1. **Push to Github / Export ZIP**: Simply download the program contents as a ZIP archive of Next.js configurations.
2. Initialize and push files to your repository:
   ```bash
   git init
   git add .
   git commit -m "Initialize Global Opportunities Hub Webapp"
   git remote add origin https://github.com/your-username/global-hub-web.git
   git branch -M main
   git push -u origin main
   ```
3. Open [Vercel](https://vercel.com/) and click **Add New Project**.
4. Import your newly created repository.
5. In **Environment Variables**, paste the following keys values:

| Environment Variable | Recommended Setting | Example Value |
|---|---|---|
| `NEXT_PUBLIC_GEMINI_API_KEY` | Your Gemini Model API key | `AIzaSy...` |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API key | `AIzaSyBO6-6CTYpXP...` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Project Identifier | `global-opportunities-hub-9b67b` |
| `NEXT_PUBLIC_FIREBASE_APPLICATION_ID` | Firebase Web App ID | `1:1056432608949:web:3d407f7...` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | FCM Messaging ID | `1056432608949` |

6. Hit **Deploy**. Vercel automatically runs your bundler, builds responsive assets, optimization routers, and delivers your production **Live Preview** URL!
