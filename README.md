# Career Bridge: Career Development Platform

Career Bridge is a comprehensive, intelligent platform designed to bridge the gap between current skills and the rapidly evolving job market. By leveraging advanced analytics, the platform helps users identify trending roles, analyze required skills, and generate personalized learning roadmaps.

## 🚀 Core Features

### 1. **Trending Job Analyzer**
*   Aggregates live market signals from **JSearch** and **Adzuna**.
*   Uses generative models to predict the top 25 high-growth roles for 2026.
*   Personalized filtering by industry (IT, Finance, Engineering, etc.).

### 2. **Intelligent Job Skill Analyzer**
*   Extracts essential and technical skills from any job title or description.
*   Provides skill-gap analysis and suggests key focus areas for career advancement.

### 3. **Dynamic Learning Resource Generator**
*   Searches **YouTube** and **Dailymotion** for targeted learning content based on specific skills.
*   Generates 10-step learning roadmaps to master new technologies.

### 4. **User Career Dashboard**
*   Secure authentication using **JWT**.
*   Save and track favorite job roles and learning progress.
*   Add personal notes and interview preparation details.

---

## 🛠 Tech Stack

### **Frontend**
*   **React (v19)**: Component-based UI development.
*   **React Router**: For seamless single-page application navigation.
*   **Axios**: For frontend-backend API communication.

### **Backend**
*   **Node.js & Express**: Scalable server-side architecture.
*   **MongoDB & Mongoose**: Flexible NoSQL data storage.
*   **Generative Models**: Powering intelligent analytics and roadmap generation.
*   **Swagger (OpenAPI)**: Comprehensive and interactive API documentation.

### **Integrations**
*   **RapidAPI (JSearch)**: Real-time job listings.
*   **Adzuna API**: Market demand and salary data.
*   **Google Trends**: Market signal simulation.
*   **YouTube Data API**: Educational video fetching.

---

## ⚙️ Installation & Setup

### **Prerequisites**
*   Node.js (v18 or higher)
*   MongoDB Atlas account or local MongoDB instance

### **1. Clone the repository**
```bash
git clone https://github.com/DasunD2002/Skill_Bridge.git
cd Skill_Bridge
```

### **2. Setup Backend**
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory and add the following keys:
```env
PORT=5000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_google_gemini_key
RAPIDAPI_KEY=your_rapidapi_key
ADZUNA_APP_ID=your_adzuna_id
ADZUNA_APP_KEY=your_adzuna_key
YOUTUBE_DATA_API_KEY=your_youtube_key
```

### **3. Setup Frontend**
```bash
cd ../frontend
npm install
```

---

## 🏃 Running the Application

### **Start Backend**
```bash
cd backend
npm start
```
*The server will run on `http://localhost:5000`*

### **Start Frontend**
```bash
cd frontend
npm start
```
*The application will open on `http://localhost:3000`*

### **📝 API Documentation**
Once the backend is running, you can access the interactive Swagger documentation at:
`http://localhost:5000/career-bridge-api-spec`

---

## 📂 Project Structure
```
Career_Bridge/
├── backend/            # Express.js Server
│   ├── Controllers/    # Business logic
│   ├── Models/         # Database schemas
│   ├── Routes/         # API endpoints
│   ├── swagger_docs/   # API specification files
│   └── utils/          # Helper functions (ResponseGenerator)
├── frontend/           # React Application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   └── pages/      # Page views
└── README.md
```
