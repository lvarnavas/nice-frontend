# Nice Backend - React Frontend

This is the React front-end application for the Nice Backend project. It connects to a back-end API server to fetch and manage data.

## Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- Running instance of the back-end API server on port `5001`

---

## Getting Started

### 1. Clone the repository

### 2. Install dependencies

npm install

### 3. Setup environment variables

Create a .env.development file in the root of the project with the following content:

REACT_APP_BACKEND_URL=http://localhost:5001/api

- This variable tells the React app where to find the back-end API.

- Make sure your back-end server is running locally on port 5001.

- You can add other REACT_APP_ prefixed variables here as needed.

### 4. Run the React development server

npm start