# 🎓 Virtual Classroom

A full-featured virtual classroom platform built with the **MERN stack**, inspired by Google Classroom. Supports real-time video meetings, AI-powered assignment grading, live meeting summaries, and a complete classroom management workflow.

![Virtual Classroom](frontend/public/image.png)

---

## ✨ Features

### 🏫 Classroom Management
- **Create & Join Classrooms** — Teachers create classrooms with unique codes; students join via code or link
- **Role-Based Access** — Teachers and students have distinct dashboards and permissions
- **Classroom Dashboard** — View enrolled students, assignments, announcements, and active meetings
- **Google Classroom-style UI** — Clean, modern interface with a familiar workflow

### 📹 Live Video Meetings
- **Real-Time Video Conferencing** — Powered by [VideoSDK](https://www.videosdk.live/) with mic, camera, and screen controls
- **Shareable Meeting Links** — One-click link sharing for easy participant access
- **Live Captions** — Browser-based speech recognition with real-time caption overlay
- **Caption Broadcasting** — Captions shared with all participants via Socket.IO
- **End Meet (Teacher)** — Teachers can end the meeting for all participants
- **Back to Classroom** — Navigate back without ending the meeting

### 🧠 AI-Powered Features
- **Live Meeting Summarizer** — Captures speech via captions, buffers text, and sends to Gemini AI every 60 seconds for concise summaries (quota-friendly: ~1 API call/min)
- **Manual Summarize** — On-demand summary generation anytime during a meeting
- **AI Assignment Grading** — Gemini evaluates student submissions against model answers, providing scores (0–10) and detailed feedback
- **Multilingual Support** — Captions in any language are summarized into English

### 📝 Assignments & Submissions
- **Create Assignments** — Teachers upload assignment files (PDF) with optional model answers and due dates
- **Student Submissions** — Students submit solutions as PDF files
- **AI Evaluation** — Automated grading with scoring rubric (Accuracy, Completeness, Clarity)
- **Manual Review** — Teachers can review, override scores, and publish results
- **Published Results** — Students see their scores and feedback once published

### 📂 Resource Sharing
- **File Upload & Search** — Upload and browse study materials, PYQs, and notes
- **OCR Text Extraction** — Extract text from uploaded PDFs using Tesseract.js & OCR.space API
- **Admin Verification** — Uploaded resources go through an admin verification pipeline

### 🔐 Authentication & Authorization
- **Local Registration** — Email + password with email OTP verification
- **Google Sign-In** — OAuth 2.0 via Google Auth Library
- **Role Selection** — Choose Teacher or Student role during registration
- **JWT Authentication** — Secure API endpoints with JSON Web Tokens
- **Super Admin** — Elevated admin dashboard for platform management

### 🌐 Production Ready
- **Health Check Endpoint** — `/health` route for deployment monitoring (Render, Railway, etc.)
- **Backend Status Indicator** — Frontend shows online/offline dot in the navbar
- **Auto Wake-Up** — Pings the backend every 60s to keep Render free-tier servers awake
- **Quota Error Handling** — Graceful Gemini API quota exhaustion with single toast notification

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI framework |
| **Vite** | Build tool & dev server |
| **React Router v6** | Client-side routing |
| **React Bootstrap** | UI components & layout |
| **VideoSDK React SDK** | Video meeting integration |
| **Socket.IO Client** | Real-time communication |
| **Axios** | HTTP client |
| **React Hot Toast** | Toast notifications |
| **Web Speech API** | Browser-native speech recognition for captions |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express** | REST API server |
| **MongoDB + Mongoose** | Database & ODM |
| **Socket.IO** | WebSocket server for real-time events |
| **JWT** | Authentication tokens |
| **Multer** | File upload handling |
| **Google Gemini AI** | Meeting summaries & assignment evaluation |
| **Tesseract.js** | Server-side OCR |
| **Google Auth Library** | Google OAuth verification |
| **Bcrypt** | Password hashing |

---

## 📁 Project Structure

```
virtualClassroom/
├── Backend/
│   ├── config/             # Database connection
│   ├── controllers/        # Route handlers (13 files)
│   │   ├── meetController.js       # Meeting management + AI summarizer
│   │   ├── classroomController.js  # Classroom CRUD
│   │   ├── assignmentController.js # Assignment management
│   │   ├── submissionController.js # Submission & AI grading
│   │   ├── adminController.js      # Admin dashboard
│   │   └── ...
│   ├── models/             # Mongoose schemas
│   │   ├── userModel.js            # User (teacher/student, local/google auth)
│   │   ├── classroomModel.js       # Classroom with meet state
│   │   ├── assignmentModel.js      # Assignment with file URLs
│   │   └── submissionModel.js      # Submission with AI evaluation fields
│   ├── routes/             # Express route definitions (13 files)
│   ├── services/           # Business logic (AI evaluator, meet notes)
│   ├── utils/              # Helpers (Gemini API wrappers, auth middleware)
│   ├── uploads/            # Temporary file storage
│   ├── index.js            # Express + Socket.IO server entry point
│   ├── .env.example        # Environment variable template
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── image.png               # App logo
│   ├── src/
│   │   ├── components/     # Reusable UI components (17 files)
│   │   │   ├── MeetingView.jsx     # Video meeting + AI summarizer
│   │   │   ├── Controls.jsx        # Meeting control bar
│   │   │   ├── ParticipantView.jsx # Video participant tile
│   │   │   ├── Login.jsx           # Login form (local + Google)
│   │   │   ├── Register.jsx        # Registration form
│   │   │   ├── navbar.jsx          # Top nav with backend status
│   │   │   └── ...
│   │   ├── pages/          # Route-level page components
│   │   │   ├── home.jsx            # Dashboard (My Classes + Explore)
│   │   │   ├── ClassroomDetail.jsx # Single classroom view
│   │   │   ├── meet.jsx            # Meeting join/create page
│   │   │   ├── evaluateSolution.jsx# AI grading interface
│   │   │   └── ...
│   │   ├── styles/         # CSS files
│   │   └── utils/          # Auth helpers, token management
│   ├── .env.example        
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18 (required for native `fetch`)
- **MongoDB** (Atlas or local)
- **npm** or **yarn**

### 1. Clone the Repository

```bash
git clone https://github.com/princekumar0018/virtualClassroom.git
cd virtualClassroom
```

### 2. Backend Setup

```bash
cd Backend
cp .env.example .env    # Copy and edit with your credentials
npm install
npm run server          # Starts on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev             # Starts on http://localhost:5173
```

---

## ⚙️ Environment Variables

### Backend (`Backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Server port (default: `4000`) |
| `mongoURL` | ✅ | MongoDB connection string |
| `SECRET_KEY` | ✅ | JWT signing secret |
| `SUPER_ADMIN` | No | Super admin email address |
| `CONTACT` | No | Contact email for unverified users |
| `VIDEOSDK_API_KEY` | ✅ | VideoSDK API key ([get here](https://app.videosdk.live/)) |
| `VIDEOSDK_SECRET` | ✅ | VideoSDK secret key |
| `GEMINI_API_KEY` | No | Google Gemini API key ([get here](https://aistudio.google.com/apikey)) |
| `GEMINI_MODEL` | No | Gemini model name (default: `gemini-2.5-pro`) |
| `OCR_API_KEY` | No | OCR.space API key ([get here](https://ocr.space/ocrapi)) |
| `OCR_API` | No | OCR.space API endpoint |
| `FRONTEND_URL` | No | Frontend URL for generating meeting links |

### Frontend (`frontend/.env`)

| Variable | Required | Description |
|---|---|---|
| `VITE_BACKEND_URL` | ✅ | Backend API URL (e.g., `http://localhost:5000`) |

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/user/register` | Register new user |
| `POST` | `/user/login` | Login (local or Google) |

### Classrooms
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/classroom/create` | Create a classroom (teacher) |
| `POST` | `/classroom/join` | Join a classroom (student) |
| `GET` | `/classroom/:id` | Get classroom details |
| `GET` | `/classroom/my` | Get user's classrooms |

### Meetings
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/meet/get-token` | Get VideoSDK JWT token |
| `POST` | `/meet/create-room` | Create a VideoSDK room |
| `POST` | `/meet/start-classroom-meet` | Start meet for a classroom |
| `POST` | `/meet/end-meet` | End meet for all participants |
| `POST` | `/meet/summarize-text` | Summarize caption text via Gemini |
| `POST` | `/meet/summarize-captions` | Summarize stored captions |
| `POST` | `/meet/live-summary` | Summarize uploaded audio |

### Assignments
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/assignment/create` | Create an assignment |
| `GET` | `/assignment/:id` | Get assignment details |

### Submissions
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/submission/submit` | Submit a solution |
| `POST` | `/submission/evaluate` | AI-evaluate a submission |
| `POST` | `/submission/publish` | Publish evaluation results |

### Health
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Backend health check (status, uptime, Gemini availability) |

---

## 🎨 Screenshots

The application features a modern, Google Classroom-inspired design with:
- **Dashboard** — Dual-section layout with "My Classes" and "Explore Classes"
- **Classroom View** — Tabbed interface for stream, classwork, people, and meetings
- **Meeting View** — Video grid with floating controls, AI panel, and live captions
- **Assignment Flow** — Create → Submit → AI Grade → Review → Publish

---

## 🚢 Deployment

### Backend (Render)

1. Push code to GitHub
2. Create a **Web Service** on [Render](https://render.com/)
3. Set build command: `npm install`
4. Set start command: `node index.js`
5. Add all environment variables from `.env`
6. The `/health` endpoint will keep the service responsive

### Frontend (Vercel / Netlify)

1. Create a new project pointing to the `frontend/` directory
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add `VITE_BACKEND_URL` environment variable pointing to your Render backend URL

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

## 👤 Author

** Ankit Raj ** — [GitHub](https://github.com/Ankitraj03711)

---

<p align="center">
  Made with ❤️ using the MERN Stack
</p>
