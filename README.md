# Media Upload App

A fullstack media upload application built with:

* React + Vite
* Spring Boot
* PostgreSQL
* AWS S3 Presigned Upload
* JWT Authentication
* Docker Compose

This project demonstrates a production-style upload architecture where files are uploaded directly from frontend to AWS S3 using presigned URLs instead of passing large files through the backend server. Because turning your backend into a glorified USB cable is rarely the optimal scaling strategy.

---

# Features

* JWT authentication
* Upload images/videos directly to S3
* Presigned URL upload flow
* Media ownership by user
* PostgreSQL metadata storage
* Dockerized frontend + backend
* CORS configuration
* Secure protected APIs
* Upload status tracking

---

# Architecture

```text id="bವ2"
Frontend (React)
    |
    | 1. Login API
    | 2. Get JWT Token
    |
    v
Spring Boot Backend
    |
    | 3. Generate Presigned URL
    |
    v
AWS S3
    |
    | 4. Direct Upload
    |
    v
Frontend
    |
    | 5. Notify Backend Upload Completed
    |
    v
PostgreSQL
```

---

# Tech Stack

## Frontend

* React
* Vite
* Axios

## Backend

* Spring Boot
* Spring Security
* JWT
* Spring Data JPA

## Infrastructure

* PostgreSQL
* AWS S3
* Docker
* Docker Compose

---

# Project Structure

```text id="cವ3"
project-root/
│
├── frontend/
│
├── backend/
│
└── docker-compose.yml
```

---

# Backend Structure

```text id="dವ4"
backend/
│
├── controller/
├── service/
├── repository/
├── entity/
├── dto/
├── security/
└── config/
```

---

# Frontend Structure

```text id="eವ5"
frontend/
│
├── src/
│   ├── api/
│   ├── services/
│   ├── App.jsx
│   └── main.jsx
```

---

# Upload Flow

## 1. User Logs In

Frontend calls:

```http id="fವ6"
POST /auth/login
```

Backend returns JWT token.

---

## 2. Frontend Stores JWT

```js id="gವ7"
localStorage.setItem("token", jwt);
```

---

## 3. Frontend Requests Presigned URL

```http id="hವ8"
POST /api/media/presign
Authorization: Bearer JWT
```

Backend:

* validates user
* generates S3 key
* generates presigned URL

---

## 4. Frontend Uploads Directly to S3

```js id="iವ9"
fetch(uploadUrl, {
  method: "PUT",
  body: file
});
```

Backend is NOT involved in file transfer.

---

## 5. Frontend Notifies Backend

```http id="jವ0"
POST /api/media/complete
```

Backend stores metadata in PostgreSQL.

---

# Why Presigned Upload?

Traditional upload:

```text id="kವ1"
Frontend -> Backend -> S3
```

Problems:

* backend bottleneck
* high memory usage
* poor scalability
* large video upload issues

Presigned upload:

```text id="lವ2"
Frontend -> S3 directly
```

Benefits:

* scalable
* faster
* cheaper
* backend handles metadata only

---

# AWS S3 Setup

---

# 1. Create Bucket

Example:

```text id="mವ3"
aws-media-upload-bucket
```

---

# 2. Configure Bucket CORS

S3 Bucket
→ Permissions
→ CORS Configuration

```json id="nವ4"
[
  {
    "AllowedHeaders": [
      "*"
    ],
    "AllowedMethods": [
      "GET",
      "PUT",
      "POST",
      "DELETE",
      "HEAD"
    ],
    "AllowedOrigins": [
      "http://localhost:5173"
    ],
    "ExposeHeaders": [
      "ETag"
    ]
  }
]
```

Without this, browser uploads fail due to CORS restrictions. Browsers are deeply committed to security theater until you configure everything precisely.

---

# Environment Variables

## Backend application.yml

```yaml id="oವ5"
aws:
  accessKey: YOUR_ACCESS_KEY
  secretKey: YOUR_SECRET_KEY
  region: us-east-1
  bucketName: aws-media-upload-bucket
```

---

# Running Locally

---

# Docker Compose

At project root:

```bash id="pವ6"
docker compose up --build
```

---

# Frontend

```text id="qವ7"
http://localhost:5173
```

---

# Backend

```text id="rವ8"
http://localhost:8080
```

---

# PostgreSQL

```text id="sವ9"
localhost:5432
```

---

# Authentication

Protected APIs require JWT:

```http id="tವ0"
Authorization: Bearer <token>
```

Public endpoints:

* `/auth/login`

Protected endpoints:

* `/api/media/**`

---

# Example API Endpoints

---

# Login

```http id="uವ1"
POST /auth/login
```

Request:

```json id="vವ2"
{
  "email": "test@mail.com",
  "password": "String123!"
}
```

---

# Get Presigned URL

```http id="wವ3"
POST /api/media/presign
```

---

# Complete Upload

```http id="xವ4"
POST /api/media/complete
```

---

# Get Current User Media

```http id="yವ5"
GET /api/media/me
```

---