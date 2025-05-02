
# CPT202 Frontend Setup Guide

## 📦 Project Setup

Follow the steps below to set up and run the frontend project locally.

### 1. Clone and Navigate to the Project Directory

```bash
cd CPT202_frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Development Environment

In `src/request.ts`, change the `baseURL` from production to development:

```ts
// Distinguish between development and production environments
const DEV_BASE_URL = "http://localhost:8080";
const PROD_BASE_URL = "http://118.31.173.230";

// Create an Axios instance
const myAxios = axios.create({
  baseURL: DEV_BASE_URL, // ← change this line
  timeout: 300000,
  withCredentials: true,
});
```

### 4. Start Backend Server

Make sure the backend server is running at `http://localhost:8080`.

### 5. Start the Frontend Server

```bash
npm run dev
```

Your application should now be running at [http://localhost:5173](http://localhost:5173) (or similar port depending on Vite settings).
