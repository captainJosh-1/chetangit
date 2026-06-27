# Backend By Chetan 
# 🎬 VideoTube Backend API

A production-ready YouTube-like backend REST API built with **Node.js**, **Express**, and **MongoDB**. Supports full video management, user auth, subscriptions, comments, likes, tweets, and playlists.

> **Base URL:** `http://localhost:8000/api/v1`

---

## 📑 Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Authentication](#authentication)
- [API Reference](#api-reference)
  - [Health Check](#-health-check)
  - [Users](#-users)
  - [Videos](#-videos)
  - [Comments](#-comments)
  - [Likes](#-likes)
  - [Playlists](#-playlists)
  - [Subscriptions](#-subscriptions)
  - [Tweets](#-tweets)
  - [Dashboard](#-dashboard)
- [Error Handling](#error-handling)
- [License](#license)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ESM) |
| Framework | Express v5 |
| Database | MongoDB + Mongoose |
| Authentication | JWT (Access + Refresh Tokens) |
| Password Hashing | bcrypt |
| File Uploads | Multer + Cloudinary |
| Cookie Handling | cookie-parser |
| CORS | cors |
| Dev Server | Nodemon |

---

## ✨ Features

- 🔐 JWT-based authentication with access & refresh token rotation
- ☁️ Video and image uploads via Cloudinary
- 📺 Full video lifecycle — upload, update, delete, publish/unpublish
- 💬 Comments with pagination
- ❤️ Like/unlike videos, comments, and tweets
- 📋 Playlist management — create, update, delete, add/remove videos
- 🔔 Subscribe/unsubscribe to channels
- 🐦 Tweet system (community posts)
- 📊 Channel dashboard — stats and video management
- 🍪 HTTP-only cookie support for secure token storage

---

## 📁 Project Structure

```
chetangit/
├── public/
│   └── temp/                  # Temporary local file storage before Cloudinary upload
├── src/
│   ├── config/
│   │   └── env.js             # Environment config loader
│   ├── controllers/
│   │   ├── comment.controller.js
│   │   ├── dashboard.controller.js
│   │   ├── healthcheck.controller.js
│   │   ├── like.controller.js
│   │   ├── playlist.controller.js
│   │   ├── subscription.controller.js
│   │   ├── tweet.controller.js
│   │   ├── user.controller.js
│   │   └── video.controller.js
│   ├── db/
│   │   └── index.js           # MongoDB connection
│   ├── middlewares/
│   │   ├── auth.middleware.js  # JWT verification
│   │   └── multer.middleware.js # File upload handling
│   ├── models/
│   │   ├── comment.model.js
│   │   ├── like.model.js
│   │   ├── playlist.model.js
│   │   ├── subscription.model.js
│   │   ├── tweet.model.js
│   │   ├── user.model.js
│   │   └── video.model.js
│   ├── routes/
│   │   ├── comment.routes.js
│   │   ├── dashboard.routes.js
│   │   ├── healthcheck.routes.js
│   │   ├── like.routes.js
│   │   ├── playlist.routes.js
│   │   ├── subscription.routes.js
│   │   ├── tweet.routes.js
│   │   ├── user.routes.js
│   │   └── video.routes.js
│   ├── utils/
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   ├── asyncHandler.js
│   │   └── cloudinary.js
│   ├── app.js                 # Express app setup
│   └── index.js               # Entry point
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

## ⚡ Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or [Atlas](https://www.mongodb.com/cloud/atlas))
- Cloudinary account

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/captainJosh-1/chetangit.git
cd chetangit

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Fill in your values in .env

# 4. Start the development server
npm run dev
```

Server starts at: `http://localhost:8000`

---

## 🔑 Environment Variables

Create a `.env` file in the root with the following keys:

```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGIN=*

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> ⚠️ Never commit `.env` — it is already in `.gitignore`.

---

## 🔐 Authentication

This API uses **JWT Bearer Tokens** with HTTP-only cookies.

**How it works:**
1. Login → receive `accessToken` + `refreshToken` (stored in cookies automatically)
2. Send `accessToken` on protected requests via cookie OR `Authorization` header
3. When `accessToken` expires → call `/api/v1/users/refresh-token` to get a new one

**Header format (if not using cookies):**
```
Authorization: Bearer <your_access_token>
```

Routes marked with 🔒 require a valid access token.

---

## 📖 API Reference

---

### 🟢 Health Check

#### `GET /api/v1/healthcheck`

Check if the server is running.

**Response:**
```json
{
  "status": "ok",
  "message": "Server is running fine"
}
```

---

### 👤 Users

Base path: `/api/v1/users`

---

#### `POST /api/v1/users/register`

Register a new user.

**Content-Type:** `multipart/form-data`

| Field | Type | Required | Description |
|---|---|---|---|
| `fullName` | string | ✅ | User's full name |
| `email` | string | ✅ | Unique email address |
| `username` | string | ✅ | Unique username (stored lowercase) |
| `password` | string | ✅ | Account password |
| `avatar` | file | ✅ | Profile image (uploaded to Cloudinary) |
| `coverImage` | file | ❌ | Cover/banner image (uploaded to Cloudinary) |

**Response `201`:**
```json
{
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "fullName": "Chetan Sharma",
    "email": "chetan@example.com",
    "username": "chetan",
    "avatar": "https://res.cloudinary.com/.../avatar.jpg",
    "coverImage": "https://res.cloudinary.com/.../cover.jpg",
    "watchHistory": [],
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "User registered successfully"
}
```

---

#### `POST /api/v1/users/login`

Login with email or username.

**Content-Type:** `application/json`

```json
{
  "email": "chetan@example.com",
  "password": "yourpassword"
}
```
> `username` can be used instead of `email`

**Response `200`:**
```json
{
  "data": {
    "user": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "fullName": "Chetan Sharma",
      "email": "chetan@example.com",
      "username": "chetan",
      "avatar": "https://res.cloudinary.com/.../avatar.jpg"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User loggedIn successfully"
}
```
> Tokens are also set as HTTP-only cookies automatically.

---

#### `POST /api/v1/users/logout` 🔒

Logout the current user. Clears cookies and invalidates refresh token.

**Response `200`:**
```json
{
  "data": {},
  "message": "User Logged Out"
}
```

---

#### `POST /api/v1/users/refresh-token`

Get a new access token using the refresh token.

**Via cookie:** Automatically sent if using cookies.

**Via body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response `200`:**
```json
{
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Access token refreshed"
}
```

---

#### `POST /api/v1/users/change-password` 🔒

Change the current user's password.

```json
{
  "oldPassword": "currentpassword",
  "newPassword": "newpassword"
}
```

**Response `200`:**
```json
{
  "data": {},
  "message": "Password changed successfully"
}
```

---

#### `GET /api/v1/users/current-user` 🔒

Get the currently logged-in user's details.

**Response `200`:**
```json
{
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "fullName": "Chetan Sharma",
    "email": "chetan@example.com",
    "username": "chetan",
    "avatar": "https://res.cloudinary.com/.../avatar.jpg",
    "coverImage": "https://res.cloudinary.com/.../cover.jpg"
  },
  "message": "Current user fetched successfully"
}
```

---

#### `PATCH /api/v1/users/update-account` 🔒

Update full name and/or email.

```json
{
  "fullName": "Chetan Kumar",
  "email": "newemail@example.com"
}
```

**Response `200`:**
```json
{
  "data": { "fullName": "Chetan Kumar", "email": "newemail@example.com" },
  "message": "Account details uploaded successfully"
}
```

---

#### `PATCH /api/v1/users/avatar` 🔒

Update profile avatar image.

**Content-Type:** `multipart/form-data`

| Field | Type | Required |
|---|---|---|
| `avatar` | file | ✅ |

---

#### `PATCH /api/v1/users/cover-image` 🔒

Update profile cover image.

**Content-Type:** `multipart/form-data`

| Field | Type | Required |
|---|---|---|
| `coverImage` | file | ✅ |

---

#### `GET /api/v1/users/c/:username` 🔒

Get a channel's public profile by username.

**Response `200`:**
```json
{
  "data": {
    "fullName": "Chetan Sharma",
    "username": "chetan",
    "email": "chetan@example.com",
    "avatar": "https://res.cloudinary.com/.../avatar.jpg",
    "coverImage": "https://res.cloudinary.com/.../cover.jpg",
    "subscriberCount": 120,
    "channelsSubscribedToCount": 45,
    "isSubscribed": false
  },
  "message": "User channel fetched successfully"
}
```

---

#### `GET /api/v1/users/history` 🔒

Get the current user's watch history.

**Response `200`:**
```json
{
  "data": [
    {
      "_id": "64f1a2b3...",
      "title": "Video Title",
      "thumbnail": "https://res.cloudinary.com/.../thumb.jpg",
      "owner": {
        "fullName": "Some Creator",
        "username": "creator",
        "avatar": "https://res.cloudinary.com/.../avatar.jpg"
      }
    }
  ],
  "message": "watch history fetched successfully"
}
```

---

### 🎥 Videos

Base path: `/api/v1/videos`

---

#### `POST /api/v1/videos` 🔒

Upload and publish a new video.

**Content-Type:** `multipart/form-data`

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | string | ✅ | Video title |
| `description` | string | ✅ | Video description |
| `videoFile` | file | ✅ | Video file (uploaded to Cloudinary) |
| `thumbnail` | file | ✅ | Thumbnail image (uploaded to Cloudinary) |

**Response `201`:**
```json
{
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
    "title": "My First Video",
    "description": "This is a great video",
    "videoFile": "https://res.cloudinary.com/.../video.mp4",
    "thumbnail": "https://res.cloudinary.com/.../thumb.jpg",
    "duration": 142.5,
    "isPublished": true,
    "owner": "64f1a2b3c4d5e6f7a8b9c0d1",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Video uploaded successfully"
}
```

---

#### `GET /api/v1/videos`

Get all published videos (paginated, newest first).

**Query Parameters:**

| Param | Type | Default | Description |
|---|---|---|---|
| `page` | number | `1` | Page number |
| `limit` | number | `10` | Results per page |

**Example:** `GET /api/v1/videos?page=1&limit=10`

**Response `200`:**
```json
{
  "data": [
    {
      "_id": "64f1a2b3...",
      "title": "My First Video",
      "thumbnail": "https://res.cloudinary.com/.../thumb.jpg",
      "duration": 142.5,
      "view": 0,
      "isPublished": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "message": "Video fetched successfully"
}
```

---

#### `GET /api/v1/videos/:videoId`

Get a single video by ID.

**Response `200`:**
```json
{
  "data": {
    "_id": "64f1a2b3...",
    "title": "My First Video",
    "description": "This is a great video",
    "videoFile": "https://res.cloudinary.com/.../video.mp4",
    "thumbnail": "https://res.cloudinary.com/.../thumb.jpg",
    "duration": 142.5,
    "view": 10,
    "isPublished": true
  },
  "message": "video is fetched successfully"
}
```

---

#### `PATCH /api/v1/videos/:videoId` 🔒

Update a video's title or description. Only the video owner can update.

```json
{
  "title": "Updated Title",
  "description": "Updated description"
}
```

> At least one field (`title` or `description`) is required.

---

#### `DELETE /api/v1/videos/:videoId` 🔒

Delete a video. Only the video owner can delete.

**Response `200`:**
```json
{
  "data": { "_id": "64f1a2b3...", "title": "My First Video" },
  "message": "video is deleted successfully"
}
```

---

#### `PATCH /api/v1/videos/:videoId/toggle-publish` 🔒

Toggle a video's published/unpublished status. Only the video owner can toggle.

**Response `200`:**
```json
{
  "message": "video is toggled"
}
```

---

### 💬 Comments

Base path: `/api/v1/comments`

> All comment routes require authentication 🔒

---

#### `POST /api/v1/comments/:videoId` 🔒

Add a comment to a video.

```json
{
  "content": "Great video!"
}
```

**Response `200`:**
```json
{
  "data": {
    "_id": "64f1a2b3...",
    "content": "Great video!",
    "video": "64f1a2b3...",
    "owner": "64f1a2b3...",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "comment added successfully"
}
```

---

#### `GET /api/v1/comments/:videoId` 🔒

Get all comments for a video (paginated, newest first).

**Query Parameters:**

| Param | Type | Default |
|---|---|---|
| `page` | number | `1` |
| `limit` | number | `10` |

---

#### `PATCH /api/v1/comments/c/:commentId` 🔒

Update a comment. Only the comment owner can update.

```json
{
  "newContent": "Updated comment text"
}
```

---

#### `DELETE /api/v1/comments/c/:commentId` 🔒

Delete a comment. Only the comment owner can delete.

---

### ❤️ Likes

Base path: `/api/v1/likes`

> All like routes require authentication 🔒

---

#### `POST /api/v1/likes/toggle/v/:videoId` 🔒

Toggle like on a video. Likes if not liked, unlikes if already liked.

**Response `200`:**
```json
{
  "data": {
    "totalLikes": 42,
    "isLiked": true
  },
  "message": "Video is liked successfully"
}
```

---

#### `POST /api/v1/likes/toggle/c/:commentId` 🔒

Toggle like on a comment.

**Response `200`:**
```json
{
  "data": {
    "totalLikes": 5,
    "isLiked": true
  },
  "message": "Comment liked successfully"
}
```

---

#### `POST /api/v1/likes/toggle/t/:tweetId` 🔒

Toggle like on a tweet.

**Response `200`:**
```json
{
  "data": {
    "totalLikes": 10,
    "isLiked": false
  },
  "message": "Tweet unliked successfully"
}
```

---

#### `GET /api/v1/likes/videos` 🔒

Get all videos liked by the current user.

**Response `200`:**
```json
{
  "data": [
    {
      "_id": "64f1a2b3...",
      "video": {
        "_id": "64f1a2b3...",
        "title": "Liked Video",
        "thumbnail": "https://res.cloudinary.com/.../thumb.jpg"
      },
      "likedBy": "64f1a2b3..."
    }
  ],
  "message": "All liked video are fetched successfully"
}
```

---

### 📋 Playlists

Base path: `/api/v1/playlists`

> All playlist routes require authentication 🔒

---

#### `POST /api/v1/playlists` 🔒

Create a new playlist.

```json
{
  "name": "My Favourites",
  "description": "Videos I love"
}
```

**Response `201`:**
```json
{
  "data": {
    "_id": "64f1a2b3...",
    "name": "My Favourites",
    "description": "Videos I love",
    "videos": [],
    "owner": "64f1a2b3...",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Playlist is created successfully"
}
```

---

#### `GET /api/v1/playlists/user/:userId` 🔒

Get all playlists of a user.

---

#### `GET /api/v1/playlists/:playlistId` 🔒

Get a playlist by ID with full video details (title, description, thumbnail).

---

#### `PATCH /api/v1/playlists/:playlistId` 🔒

Update playlist name or description. Only the playlist owner can update.

```json
{
  "name": "Updated Name",
  "description": "Updated description"
}
```

> At least one field is required.

---

#### `DELETE /api/v1/playlists/:playlistId` 🔒

Delete a playlist. Only the playlist owner can delete.

---

#### `PATCH /api/v1/playlists/add/:videoId/:playlistId` 🔒

Add a video to a playlist.

**Response `200`:**
```json
{
  "data": {
    "_id": "64f1a2b3...",
    "name": "My Favourites",
    "videos": ["64f1a2b3...", "64f1a2b4..."]
  },
  "message": "Video Added successfully"
}
```

---

#### `PATCH /api/v1/playlists/remove/:videoId/:playlistId` 🔒

Remove a video from a playlist.

---

### 🔔 Subscriptions

Base path: `/api/v1/subscription`

> All subscription routes require authentication 🔒

---

#### `POST /api/v1/subscription/c/:channelId` 🔒

Subscribe or unsubscribe from a channel. Toggles automatically.

> Cannot subscribe to yourself.

**Response `200`:**
```json
{
  "data": {
    "totalSubscriber": 101,
    "isSubscribed": true
  },
  "message": "channel subscribed successfully"
}
```

---

#### `GET /api/v1/subscription/c/:channelId` 🔒

Get all subscribers of a channel.

**Response `200`:**
```json
{
  "data": {
    "totalSubscriber": 2,
    "subscribers": [
      {
        "subscriberId": "64f1a2b3...",
        "username": "john_doe",
        "email": "john@example.com"
      }
    ]
  },
  "message": "Subscribers fetched successfully"
}
```

---

#### `GET /api/v1/subscription/u` 🔒

Get all channels the current user has subscribed to.

**Response `200`:**
```json
{
  "data": {
    "count": 3,
    "channels": [
      {
        "channelId": "64f1a2b3...",
        "username": "tech_channel",
        "email": "tech@example.com"
      }
    ]
  },
  "message": "Subscribed channels fetched successfully"
}
```

---

### 🐦 Tweets

Base path: `/api/v1/tweets`

> All tweet routes require authentication 🔒

---

#### `POST /api/v1/tweets` 🔒

Create a new tweet (community post).

```json
{
  "content": "Hello World! This is my first tweet."
}
```

**Response `201`:**
```json
{
  "data": {
    "_id": "64f1a2b3...",
    "content": "Hello World! This is my first tweet.",
    "owner": "64f1a2b3...",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Tweet is added successfully"
}
```

---

#### `GET /api/v1/tweets/user/:userId` 🔒

Get all tweets by a specific user (newest first).

**Response `200`:**
```json
{
  "data": [
    {
      "_id": "64f1a2b3...",
      "content": "Hello World!",
      "owner": "64f1a2b3...",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "message": "User tweets fetched successfully"
}
```

---

#### `PATCH /api/v1/tweets/:tweetId` 🔒

Update a tweet. Only the tweet owner can update.

```json
{
  "content": "Updated tweet content"
}
```

---

#### `DELETE /api/v1/tweets/:tweetId` 🔒

Delete a tweet. Only the tweet owner can delete.

---

### 📊 Dashboard

Base path: `/api/v1/dashboards`

> All dashboard routes require authentication 🔒

---

#### `GET /api/v1/dashboards/stats` 🔒

Get channel statistics for the current user.

**Response `200`:**
```json
{
  "data": {
    "totalsubscriber": 250,
    "totalVideo": 12,
    "totalViews": 15400,
    "totalLikes": 890
  },
  "message": "Channel stats fetched successfully"
}
```

---

#### `GET /api/v1/dashboards/videos` 🔒

Get all videos uploaded by the current user (for channel management).

**Response `200`:**
```json
{
  "data": [
    {
      "_id": "64f1a2b3...",
      "title": "My Video",
      "thumbnail": "https://res.cloudinary.com/.../thumb.jpg",
      "isPublished": true,
      "view": 500,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "message": "Channel videos fetched successfully"
}
```

---

## ⚠️ Error Handling

All errors follow a consistent format:

```json
{
  "statusCode": 404,
  "message": "Video not found",
  "success": false
}
```

| Status Code | Meaning |
|---|---|
| `400` | Bad Request — missing or invalid fields |
| `401` | Unauthorized — missing or invalid token |
| `403` | Forbidden — you don't own this resource |
| `404` | Not Found — resource doesn't exist |
| `409` | Conflict — duplicate email or username |
| `500` | Internal Server Error |

---

## 🚧 Roadmap

- [x] User auth (register, login, logout, token refresh)
- [x] Video upload, management & publish toggle
- [x] Comments with pagination
- [x] Like/unlike system (videos, comments, tweets)
- [x] Playlist management
- [x] Subscriptions
- [x] Tweets / community posts
- [x] Channel dashboard & stats
- [ ] Deployment (Railway / Render)

---

## 📮 Postman Collection

Test all API endpoints instantly using the Postman collection:

[![Run in Postman](https://run.pstmn.io/button.svg)](https://chetanoffi-23-3339242.postman.co/workspace/Chetan-Rajput's-Workspace~9c929c5b-ecb4-4433-813d-b5802cf97f87/collection/51147805-4778aeea-bbb0-44e4-91eb-9cb892c9aec4?action=share&source=copy-link&creator=51147805)

> Import the collection in Postman and set `baseURL` to `http://localhost:8000/api/v1` to get started.

---

## 👨‍💻 Author

**Chetan**
- GitHub: [@captainJosh-1](https://github.com/captainJosh-1)

---

## 📄 License

This project is licensed under the **ISC License**.
