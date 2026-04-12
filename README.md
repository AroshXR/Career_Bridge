# Career Bridge: Intelligent Career Development Platform

Career Bridge is a comprehensive, intelligent platform designed to bridge the gap between current skills and the rapidly evolving job market. By leveraging advanced analytics, Generative AI models, and real-time market signals, the platform helps users identify trending roles, analyze required skills, and generate personalized learning roadmaps.

---

## AF Submission Details

*   **Project Name:** Career Bridge
*   **Version:** 1.0.0 (Production Release)
*   **Authors:** SE-37, 
*   **Submission Date:** April 12, 2026

---

## Tech Stack

### **Frontend**
*   **React (v19)**: Component-based UI development with modern hooks.
*   **Vanilla CSS**: Custom premium styling with HSL color tokens and glassmorphism.
*   **React Router**: Seamless single-page application (SPA) navigation.
*   **Axios**: Secure frontend-backend communication.

### **Backend**
*   **Node.js & Express**: Scalable and modular server architecture.
*   **MongoDB & Mongoose**: Flexible NoSQL data storage and schema management.
*   **Generative AI (Gemini/Groq)**: Powering skill analytics and roadmap generation.
*   **Swagger (OpenAPI)**: Comprehensive and interactive API documentation.

### **Integrations**
*   **Adzuna API**: Real-time market demand and global salary benchmarks.
*   **YouTube Data API v3**: Targeted educational video fetching.
*   **Passport.js**: Secure OAuth2 and Local authentication.
*   **Nodemailer**: Automated progress reminders and notifications.

---

## Installation & Setup

### **Prerequisites**
*   Node.js (v20.x or higher)
*   MongoDB Atlas instance (or local MongoDB v7.0+)
*   Gmail account for automated notifications (App Password required)

### **1. Clone the repository**
```bash
git clone https://github.com/DasunD2002/Career__Bridge_Platform.git
cd Career__Bridge_Platform
```

### **2. Setup Backend**
```bash
cd backend
npm install
```

### **3. Setup Frontend**
```bash
cd ../frontend
npm install
```
Create a `.env` file in the `frontend` directory:
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_WEB3FORMS_ACCESS_KEY=your_web3forms_key
```

---

## Running the Application

### **Start Backend**
```bash
cd backend
npm start
```
*Server: http://localhost:5000*

### **Start Frontend**
```bash
cd frontend
npm start
```
*App: http://localhost:3000*

---

## API Endpoint Documentation

The system provides a modular API architecture. Below documentation contains the primary technical specifications for core modules.
[SE_37_Career_Bridge_API_Spec](https://mysliit-my.sharepoint.com/:b:/g/personal/it23564886_my_sliit_lk/IQDyrzWLaheBTour_vtKZ4ZeAeU9oMJzBF0CsyDC7etaMpE?e=MGk7Jd)

---

## Deployment

### **Live Deployment**
*   **Backend Hosting:** [Render](https://career-bridge-platform.onrender.com)
*   **Frontend Hosting:** [Netlify](https://careerbridge37.netlify.app)
*   **Database:** MongoDB Atlas (AWS Region: N. Virginia)

**Find the depolyment report from below link.**
[Career_Bridge_Deployment_Report](https://mysliit-my.sharepoint.com/:b:/g/personal/it23564886_my_sliit_lk/IQCoV1cKbVHwTrFP3-Lu-u6rAWNTdPRZxIQcge5Jjk22G3M?e=ZMXw6m)

---

## Testing

### **Testing Summary**
*   **Functional Testing:** Verified all 35+ API endpoints using Postman scripts.
*   **Integration Testing:** Validated full user flow from Google Sign-In to Roadmap completion.
*   **Performance:** Optimized Trending Job Analyzer with manual triggers to reduce page load latency.
*   **Reliability:** Implemented SMTP failover and background email handling (Port 587 STARTTLS).

**Find the testing report from below link.**
[Career_Bridge_Testing_Report](https://mysliit-my.sharepoint.com/:b:/g/personal/it23564886_my_sliit_lk/IQCr_n2WBIu7RKavcDo4rgeiAbWzG11PPssFrk8llIq6yyM?e=hGoxqN)

---

## Project Structure
```text
Career_Bridge_Platform/
├── backend/                # Express.js API Server
│   ├── config/             # Connection and Authentication configurations
│   ├── Controllers/        # Business logic (AI analytics, User flows)
│   ├── Models/             # Mongoose Schemas (User, Resource, Progress)
│   ├── Routes/             # Modular API endpoint definitions
│   ├── swagger_docs/       # OpenAPI specification files
│   └── utils/              # Shared helpers (Nodemailer, MultiReplace)
├── frontend/               # React SPA Frontend
│   ├── public/             # Static assets (Favicon, Index.html)
│   └── src/
│       ├── components/     # Premium UI components (Atomic design)
│       ├── services/       # API interaction layers
│       ├── tests/          # Component and integration tests
│       └── App.js          # Main application entry and routing
└── README.md               # AF Submission & Setup Documentation
```
