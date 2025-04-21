# AI-Powered Recruitment Tool

## Overview
This is a full-stack web application designed to help recruiters manage job postings and evaluate candidates using AI-assisted matching. The tool provides features for job management, candidate processing, and AI-powered matching between candidates and job requirements.

> **Note:** While this project was built primarily with my own code, I used AI assistance for:
> - NLP processing implementation  
> - Basic page templates (sign-in, login)  
> - Some reusable UI components  

---

## Features

### 🔐 User Authentication
- Recruiter registration and login
- JWT-based authentication
- Protected routes

### 📋 Job Management
- Create, view, and edit job postings
- Specify job title, description, and required skills
- List view of all active postings

### 📎 Candidate Processing
- Upload resumes in PDF or DOCX format
- Extract key information (skills, experience, education)
- Store candidate profiles with metadata

### 🤖 AI Matching
- Match candidates to jobs based on skills and experience
- Generate match scores (percentage)
- Sort candidates by match quality

### 📊 Dashboard
- View key metrics (candidates per job, average scores)
- See top candidates for each position
- Quick access to all features

---

## 🛠️ Technology Stack

### Frontend
- React with Vite
- JSX components
- TailwindCSS for styling
- Redux for state management
- Axios for API calls

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads

### AI/NLP Processing
- PDF and DOCX text extraction
- Natural language processing for skill extraction
- Custom matching algorithms
- TF-IDF and Jaccard similarity for scoring

---

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## 🔧 Backend Setup

Navigate to the backend directory:


cd recruitment-tool-backend

### Install dependencies:

npm install

Create a .env file based on .env.example:
env

MONGO_URI=your_mongo_url
JWT_SECRET=your_secure_jwt_secret
PORT=5000

### Start the backend server:

npm start

## 🎨 Frontend Setup
Navigate to the frontend directory:

cd recruitment-tool-frontend
### Install dependencies:


npm install

### Start the development server:


npm run dev


### 🧪 Usage
Access the application at http://localhost:5173

 - Register as a recruiter

 - Create job postings with required skills

 - Upload candidate resumes

 - View matches and dashboard metrics
