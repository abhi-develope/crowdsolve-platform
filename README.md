# CrowdSolve Platform

CrowdSolve is a collaborative problem-solving platform where users can post problems, share solutions, and engage in discussions to find the best answers collectively.

## 📱 Application Screenshots

<p align="center">
  <img src="./Screenshots/Screenshot (83).png" width="200"/>
  <img src="./Screenshots/Screenshot (82).png" width="200"/>
  <img src="./Screenshots/Screenshot (81).png" width="200"/>
  <img src="./Screenshots/Screenshot (80).png" width="200"/>
  <img src="./Screenshots/Screenshot (79).png" width="200"/>
  <img src="./Screenshots/Screenshot (78).png" width="200"/>
  
</p>

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## 🔍 Overview

CrowdSolve is designed to harness the power of collective intelligence by allowing users to collaborate on solving problems across various domains. Users can post problems, contribute solutions, upvote the best answers, and engage in discussions through comments.

## ✨ Features

- **User Authentication**: Secure signup, login, and profile management
- **Problem Management**: Create, view, update, and delete problems
- **Solution Submission**: Submit solutions to existing problems
- **Voting System**: Upvote the best solutions
- **Comments**: Discuss solutions through threaded comments
- **Real-time Updates**: See new solutions and comments without page refresh
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend

- **React**: UI library for building the user interface
- **React Router**: For navigation and routing
- **Axios**: For API requests
- **Bootstrap**: For styling and responsive design
- **Tailwind CSS**: For additional styling utilities
- **Vite**: Build tool and development server

### Backend

- **Node.js**: JavaScript runtime
- **Express**: Web framework for Node.js
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: For authentication
- **Bcrypt**: For password hashing
- **Multer**: For file uploads
- **Cloudinary**: For image storage

## 📁 Project Structure

```
crowdsolve-platform/
├── backend/                # Backend server code
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Request handlers
│   │   ├── middlewares/    # Express middlewares
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utility functions
│   │   ├── validators/     # Input validation
│   │   └── server.js       # Entry point
│   └── uploads/            # Uploaded files
├── frontend/               # React frontend
│   ├── public/             # Static files
│   └── src/
│       ├── api/            # API integration
│       ├── assets/         # Images, fonts, etc.
│       ├── components/     # Reusable components
│       ├── context/        # React context providers
│       ├── pages/          # Page components
│       ├── App.jsx         # Main component
│       └── main.jsx        # Entry point
└── README.md               # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/crowdsolve-platform.git
   cd crowdsolve-platform
   ```

2. Install backend dependencies:

   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

### Environment Variables

#### Backend (.env)

Create a `.env` file in the `backend` directory with the following variables:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/crowdsolve
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## 🏃‍♂️ Running the Application

### Development Mode

1. Start the backend server:

   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend development server:

   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

### Production Mode

1. Build the frontend:

   ```bash
   cd frontend
   npm run build
   ```

2. Start the backend server:
   ```bash
   cd backend
   npm start
   ```

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get current user profile

### Problem Endpoints

- `GET /api/problems` - Get all problems
- `GET /api/problems/:id` - Get a specific problem
- `POST /api/problems` - Create a new problem
- `PUT /api/problems/:id` - Update a problem
- `DELETE /api/problems/:id` - Delete a problem

### Solution Endpoints

- `GET /api/solutions/problems/:problemId/solutions` - Get all solutions for a problem
- `POST /api/solutions/problems/:problemId/solutions` - Add a solution to a problem
- `PUT /api/solutions/:id` - Update a solution
- `DELETE /api/solutions/:id` - Delete a solution
- `PUT /api/solutions/:id/upvote` - Upvote a solution

### Comment Endpoints

- `POST /api/solutions/:solutionId/comments` - Add a comment to a solution
- `PUT /api/comments/:id` - Update a comment
- `DELETE /api/comments/:id` - Delete a comment

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ by Abhishek Prajapati
