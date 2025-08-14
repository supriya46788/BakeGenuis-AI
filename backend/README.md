# Backend - BakeGenius AI

This directory contains the backend code for the BakeGenius AI project. The backend is built using Node.js and Express.js, providing APIs for user authentication, recipe conversions, and other functionalities.

## Key Features
- User authentication (signup, login, and profile retrieval)
- Integration with MongoDB for data storage
- Secure password hashing using bcrypt
- JWT-based authentication for secure API access

## Structure
- `server.js`: Main server file
- `routes/`: Contains route definitions (e.g., `auth.js` for authentication)
- `models/`: Contains database models (e.g., `User.js` for user data)

## How to Run
1. Install dependencies: `npm install`
2. Start the server: `npm start` or `npm run dev` (for development mode)
3. Ensure `.env` file is configured with `MONGO_URI` and `JWT_SECRET`.