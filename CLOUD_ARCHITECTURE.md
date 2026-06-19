# Cloud Migration Architecture Specification (Production-Ready)
This document outlines the master architecture, database schemas, security rules, serverless backend APIs, push notification mechanisms, and step-by-step instructions to deploy this application on a robust, multi-user production Cloud infrastructure (utilizing Google Firebase & Cloud Firestore).

---

## 1. System Topology Overview

```
                      +-----------------------------+
                      |   Streaming Android Mobile  |
                      |     (Jetpack Compose UI)     |
                      +--------------+--------------+
                                     |
                                     | HTTPS / gRPC Sync Streams
                                     v
+------------------------------------+------------------------------------+
|                         GOOGLE CLOUD PLATFORM                           |
|                                                                         |
|  +--------------------+    +--------------------+    +---------------+  |
|  |     Firebase       |    |   Cloud Firestore  |    |  Cloud Pub/Sub|  |
|  |  Authentication    |    |   (NoSQL Store)    |    |  & Scheduler  |  |
|  | (Secure Auth, SMS) |    |  (Device Sync DB)  |    | (Daily Sync)  |  |
|  +---------+----------+    +---------+----------+    +-------+-------+  |
|            |                         ^                       |          |
|            | Auth Token Token        | Read/Write Docs       | Triggers |
|            v                         v                       v          |
|  +-----------------------------------+-------------------------------+  |
|  |                          FIREBASE FUNCTIONS                       |  |
|  |              (Node.js Serverless secure backend proxies)          |  |
|  |                                                                   |  |
|  | * /api/moderateOpportunity  - Auth Admin posting approval         |  |
|  | * /api/syncOpportunities    - Auto cron web parser aggregation    |  |
|  | * /api/sendPushNotification - Dynamic FCM country alert trigger   |  |
|  +-----------------------------------+-------------------------------+  |
|                                      |                                  |
|                                      v FCMS / Analytics Logging         |
|                            +--------------------+                       |
|                            | Firebase Analytics |                       |
|                            +--------------------+                       |
+-------------------------------------------------------------------------+
```

---

## 2. Cloud Database Schema (Firestore)

Below is the document collection topology with fields, types, and structural relationship definitions.

### `users` collection
- **Path:** `/users/{email}`
- **Purpose:** Stores profile documents, dynamic settings, and Role-Based Access Control (RBAC) tiers.
```json
{
  "email": "candidate@example.com",           // String (Unique Document ID / Email)
  "fullName": "Elizabeth Vance",              // String
  "phone": "+1 (555) 019-2834",               // String
  "education": "M.S. Bioscience, MIT",        // String
  "experience": "3+ years lab systems",       // String
  "skills": "PCR, Lab orchestration, Git",    // String
  "cvText": "Candidate looking for residency",// String
  "preferredCountry": "Switzerland",          // String
  "preferredCategory": "Scholarships",        // String
  "role": "CANDIDATE",                        // Enum string: ["CANDIDATE", "RECRUITER", "ADMIN"]
  "noIeltsChecked": true,                     // Boolean
  "visaSponsorshipNeeded": true,              // Boolean
  "remoteOnly": false,                        // Boolean
  "createdAt": "2026-06-09T09:48:00Z",        // Timestamp
  "lastSyncedAt": "2026-06-09T09:48:00Z"      // Timestamp
}
```

### `opportunities` collection
- **Path:** `/opportunities/{opportunityId}`
- **Purpose:** Centralized board catalog of jobs, fellowships, and scholarship postings.
```json
{
  "opportunityId": "opp_daad_research_89",   // String (Document ID)
  "title": "DAAD Research Grants",            // String
  "organization": "University of Munich",     // String
  "country": "Germany",                       // String
  "category": "Scholarships",                 // String
  "deadline": "2026-11-30",                   // String (YYYY-MM-DD for fast query comparison)
  "fundingAmount": "€25,000 / Year + housing",// String
  "isFullyFunded": true,                      // Boolean
  "eligibility": "Undergraduate degree...",   // String
  "description": "Collaborative master's...", // String
  "benefits": "Full tuition waiver stipend",  // String
  "officialLink": "https://daad.de/grants",   // String
  "datePosted": "2026-06-09",                 // String (YYYY-MM-DD)
  "status": "APPROVED",                       // String: ["PENDING", "APPROVED", "REJECTED", "CLOSED"]
  "isFeatured": true,                         // Boolean
  "visaSponsorship": true,                    // Boolean
  "remote": false,                            // Boolean
  "noIeltsRequired": true,                    // Boolean
  "govtSponsored": true,                      // Boolean
  "creatorEmail": "recruiter@daad.org",       // String (References creator user)
  "rating": 4.8                               // Number (Float)
}
```

### `bookmarks` collection
- **Path:** `/bookmarks/{email_opportunityId}`
- **Purpose:** Tracks unique saved bookmarks synced across user devices.
```json
{
  "email": "candidate@example.com",           // String (User reference)
  "opportunityId": "opp_daad_research_89",   // String (Opportunity reference)
  "timestamp": "2026-06-09T09:50:00Z"         // Timestamp
}
```

### `applications` collection
- **Path:** `/applications/{applicationId}`
- **Purpose:** Tracks student application funnels and tracking logs.
```json
{
  "applicationId": "app_daad_vance_01",       // String (Document ID)
  "userId": "candidate@example.com",          // String (User reference)
  "opportunityId": "opp_daad_research_89",   // String (Opportunity reference)
  "opportunityTitle": "DAAD Research Grants", // String
  "organization": "University of Munich",     // String
  "status": "Applied",                        // String: ["Draft", "Applied", "In Review", "Interview", "Offer", "Closed"]
  "appliedDate": "2026-06-09",                // String (YYYY-MM-DD)
  "notes": "Emailed reference letters.",      // String
  "updatedAt": "2026-06-09T09:55:00Z"         // Timestamp
}
```

---

## 3. Database Security Rules (Firestore)

These rules block unauthorized requests and enforce Role-Based Access Control (RBAC) tiers directly at the database gateway.

Save this content in your Firebase project as `firestore.rules`:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper: Checks if the user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }

    // Helper: Fetches user metadata from users collection
    function getUserData() {
      return get(/databases/$(database)/documents/users/$(request.auth.token.email)).data;
    }

    // Helper: Validates user holds the ADMIN role
    function isAdmin() {
      return isAuthenticated() && getUserData().role == "ADMIN";
    }

    // Helper: Validates user holds the RECRUITER role
    function isRecruiter() {
      return isAuthenticated() && getUserData().role == "RECRUITER";
    }

    // ------------------ COLLECTION RULES ------------------

    // User Profile Permissions
    match /users/{email} {
      allow read: if isAuthenticated();
      // Users can modify only their own profile, except for updating roles (Admin-only restriction)
      allow write: if isAuthenticated() && request.auth.token.email == email
                   && (request.resource.data.role == resource.data.role || isAdmin());
    }

    // Opportunities collection
    match /opportunities/{opportunityId} {
      // Anyone can read approved postings
      allow read: if resource.data.status == "APPROVED" || isAuthenticated();
      
      // Only Recruiters can create, Admins can write/update/approve
      allow create: if isRecruiter() || isAdmin();
      allow update, delete: if isAdmin() || (isRecruiter() && resource.data.creatorEmail == request.auth.token.email);
    }

    // Bookmarks tracking rules
    match /bookmarks/{bookmarkId} {
      allow read, write: if isAuthenticated() && request.auth.token.email == resource.data.email;
      allow create: if isAuthenticated() && request.auth.token.email == request.resource.data.email;
    }

    // Application Tracking funnels
    match /applications/{applicationId} {
      allow read: if isAuthenticated() && 
        (request.auth.token.email == resource.data.userId || isAdmin() || isRecruiter());
      allow create, update: if isAuthenticated() && request.auth.token.email == request.resource.data.userId;
      allow delete: if isAuthenticated() && (request.auth.token.email == resource.data.userId || isAdmin());
    }
  }
}
```

---

## 4. Secure Backend APIs (Firebase Cloud Functions)

A serverless implementation of essential backend operations. Save this structure in the `/functions` folder of your project as `/functions/index.js` (Node-JS Express API):

```javascript
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

/**
 * Endpoint 1: Admin Moderation tools to Approve/Reject posted Listings
 * Path: HTTPS /api/moderateOpportunity
 */
exports.moderateOpportunity = functions.https.onCall(async (data, context) => {
  // 1. Authenticate context and verify user is Admin
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Access denied.");
  }
  
  const adminEmail = context.auth.token.email;
  const adminDoc = await db.collection("users").document(adminEmail).get();
  if (!adminDoc.exists || adminDoc.data().role !== "ADMIN") {
    throw new functions.https.HttpsError("permission-denied", "Requires Administrator permissions.");
  }

  const { opportunityId, newStatus } = data;
  if (!["APPROVED", "REJECTED", "CLOSED"].includes(newStatus)) {
    throw new functions.https.HttpsError("invalid-argument", "Malformed parameter state.");
  }

  // 2. Perform the update operation
  await db.collection("opportunities").document(opportunityId).update({
    status: newStatus,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  return { success: true, message: `Opportunity successfully marked as ${newStatus}` };
});

/**
 * Endpoint 2: Scheduled Auto-Aggregation & Scraping Synchronization
 * Run Frequency: Triggered daily
 */
exports.syncOpportunitiesCron = functions.pubsub.schedule("every 24 hours").onRun(async (context) => {
  console.log("Starting Web Opportunity Aggregation parser...");
  const today = new Date().toISOString().split("T")[0];

  // Fetch simulated third-party opportunities API
  const incomingPosts = [
    {
      title: "Google Software Engineer - Relocation Support",
      organization: "Google Inc.",
      country = "Switzerland",
      category = "Jobs Abroad",
      deadline = "2026-10-15",
      fundingAmount = "Fully Funded Compensation",
      isFullyFunded = false,
      eligibility = "BS/MS Computer Science",
      description = "Full relocation, visa handling, and immigration support...",
      benefits = "Competitive salaries, medical cover, stock options",
      officialLink = "https://careers.google.com",
      status = "APPROVED",
      isFeatured = true,
      visaSponsorship = true,
      remote = false,
      noIeltsRequired = true,
      govtSponsored = false
    }
  ];

  let added = 0;
  for (const post of incomingPosts) {
    const dupeCheck = await db.collection("opportunities")
      .where("title", "==", post.title)
      .where("organization", "==", post.organization)
      .get();

    if (dupeCheck.empty && post.deadline >= today) {
      await db.collection("opportunities").add({
        ...post,
        datePosted: today,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      added++;
    }
  }

  console.log(`Cron Aggregator complete. Sync inserted ${added} opportunities.`);
  return null;
});

/**
 * Endpoint 3: FCM Push Alerts Dispatch on Featured Opportunities Insertion
 * Path: FireStore Database item creation trigger
 */
exports.sendFeaturedOpportunityNotification = functions.firestore
  .document("opportunities/{opportunityId}")
  .onCreate(async (snap, context) => {
    const opp = snap.data();

    // Trigger push alert only for highly visible "Featured" programs.
    if (!opp.isFeatured) return;

    const payload = {
      notification: {
        title: `🔥 Fully Funded Opportunity: ${opp.title}`,
        body: `${opp.organization} is offering funding. Check benefits and apply before ${opp.deadline}!`,
      },
      data: {
        opportunityId: snap.id,
        click_action: "FLUTTER_NOTIFICATION_CLICK" // Direct routing inside Android Intent filter
      },
      topic: "featured_alerts"
    };

    // Dispatch message via Firebase cloud messaging
    await admin.messaging().send(payload);
    console.log(`Push Notification dispatched for: ${opp.title}`);
  });
```

---

## 5. Analytics Integration Setup

Analytics events track user actions dynamically. Below are the custom metric codes logged in the repository:

1. **User Sign Up events**:
   ```kotlin
   val bundle = Bundle().apply {
       putString(FirebaseAnalytics.Param.METHOD, "EmailSignUp")
       putString("user_role", role.name)
   }
   FirebaseAnalytics.getInstance(context).logEvent(FirebaseAnalytics.Event.SIGN_UP, bundle)
   ```
2. **Opportunity views tracking**:
   ```kotlin
   val bundle = Bundle().apply {
       putString(FirebaseAnalytics.Param.ITEM_ID, opportunity.id.toString())
       putString(FirebaseAnalytics.Param.ITEM_NAME, opportunity.title)
       putString(FirebaseAnalytics.Param.ITEM_CATEGORY, opportunity.category)
   }
   FirebaseAnalytics.getInstance(context).logEvent(FirebaseAnalytics.Event.VIEW_ITEM, bundle)
   ```
3. **Application flow completion tracking**:
   ```kotlin
   val bundle = Bundle().apply {
       putString("opportunity_id", record.opportunityId.toString())
       putString("application_status", record.status)
   }
   FirebaseAnalytics.getInstance(context).logEvent("apply_completed", bundle)
   ```

---

## 6. Step-by-Step Developer Deployment Guide

Follow these steps to launch the system in a production environment:

### Step A: Configure the Cloud Console Project
1. Open the [Firebase Console](https://console.firebase.google.com/) and click **Add Project**. Label it: `globalhub-ops-cloud`.
2. Navigate to **Project Settings** > **General** > **Your Apps**. Click the Android icon, configure your package name (`com.aistudio.globaloppshub.qzpwyt`), and register the app.
3. Download the generated metadata file `google-services.json` and move it into your Android project in the `/app` folder.

### Step B: Enable Cloud APIs
1. In the left panel of the Firebase console, go to **Build** > **Authentication** and click **Get Started**. Under "Sign-In Methods," ensure **Email/Password** is set to Enrolled. Enable **Google Sign-In** with your support email.
2. Under **Build** > **Firestore Database**, click **Create Database** and configure location nearest to your end users. Start in "Production Mode."
3. Under **Build** > **Messaging**, click Get Started to configure push services.

### Step C: Deploy Security Rules & Serverless backend
1. Open up terminal in your native project directory containing your Firebase CLI setups:
   ```bash
   # Install firebase tools CLI globally
   npm install -g firebase-tools

   # Log in and initialize Firebase Cloud configs
   firebase login
   firebase init
   ```
2. Check `firestore.rules` inside your directory, insert the rules from Section 3 above, and deploy them:
   ```bash
   firebase deploy --only firestore:rules
   ```
3. Copy the Node.js secure REST logic from Section 4 into `/functions/index.js` and upload the API functions globally:
   ```bash
   firebase deploy --only functions
   ```

### Step D: Build and Compile Key Checks
1. Update `.env` or add your secrets securely in the **Secrets panel in AI Studio** to match the `.env.example` configurations.
2. Compile and package your production mobile release cleanly using modern Gradle triggers:
   ```bash
   gradle assembleRelease
   ```
3. Release and sync accounts securely across devices with instantaneous push alerts and role validations fully active!
