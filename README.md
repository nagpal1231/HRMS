# HRMS

A modern Human Resource Management System built with React and FastAPI.

![HRMS](https://img.shields.io/badge/Status-Live-brightgreen) ![React](https://img.shields.io/badge/React-18-blue) ![FastAPI](https://img.shields.io/badge/FastAPI-0.109-green) ![Python](https://img.shields.io/badge/Python-3.11+-yellow) ![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-purple)

## Project Overview

HRMS is a web-based application that allows an admin to:

- **Manage employee records** – Add, view (grid/list toggle), and delete employees
- **Track daily attendance** – Mark attendance (Present/Absent) for each employee and view records
- **Dashboard** – Animated overview with stats cards, attendance ring chart, department bar chart, and employee table

### Key Features

- Collapsible sidebar navigation with animated active indicators
- Dark / light theme toggle with persistent preference
- Page transition animations powered by Framer Motion
- Glassmorphism card design with backdrop blur
- Color-coded avatar initials generated from employee names
- Grid & list view toggle on the Employees page
- Filter attendance records by employee or date
- Live present/absent summary counters
- Fully responsive – mobile sidebar drawer, adaptive grids

## Tech Stack

| Layer      | Technology                                    |
| ---------- | --------------------------------------------- |
| Frontend   | React 18, Vite, Tailwind CSS, Framer Motion   |
| Backend    | Python, FastAPI, SQLAlchemy                    |
| Database   | SQLite (dev) / PostgreSQL (prod)               |
| Deployment | Vercel (Frontend), Render (Backend)            |

## Project Structure

```
HRMS/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py          # FastAPI application entry point
│   │   ├── database.py      # Database configuration
│   │   ├── models.py        # SQLAlchemy models
│   │   ├── schemas.py       # Pydantic schemas/validation
│   │   ├── crud.py          # Database operations
│   │   └── routes/
│   │       ├── employees.py  # Employee API endpoints
│   │       ├── attendance.py # Attendance API endpoints
│   │       └── dashboard.py  # Dashboard API endpoint
│   ├── requirements.txt
│   └── Procfile
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── Avatar.jsx    # Color-coded initial avatars
│   │   │   ├── Badge.jsx     # Status & department badges
│   │   │   ├── Card.jsx      # Glass-morphism card system
│   │   │   ├── EmptyState.jsx
│   │   │   ├── ErrorState.jsx
│   │   │   ├── Layout.jsx    # Sidebar layout + top header
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── Modal.jsx     # Animated modal with spring physics
│   │   ├── context/
│   │   │   └── ThemeContext.jsx  # Dark/light theme provider
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx # Stats, ring chart, dept bars
│   │   │   ├── Employees.jsx # Grid/list view with search
│   │   │   └── Attendance.jsx# Mark & view attendance
│   │   ├── services/
│   │   │   └── api.js        # Axios API service layer
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## API Endpoints

### Employees

| Method | Endpoint                | Description         |
| ------ | ----------------------- | ------------------- |
| GET    | `/api/employees/`       | List all employees  |
| GET    | `/api/employees/{id}`   | Get single employee |
| POST   | `/api/employees/`       | Create employee     |
| DELETE | `/api/employees/{id}`   | Delete employee     |

### Attendance

| Method | Endpoint                              | Description                    |
| ------ | ------------------------------------- | ------------------------------ |
| POST   | `/api/attendance/`                    | Mark attendance                |
| GET    | `/api/attendance/employee/{id}`       | Get employee attendance        |
| GET    | `/api/attendance/employee/{id}?date=` | Filter attendance by date      |
| GET    | `/api/attendance/date/{date}`         | Get all attendance for a date  |

### Dashboard

| Method | Endpoint           | Description        |
| ------ | ------------------ | ------------------ |
| GET    | `/api/dashboard/`  | Get summary stats  |

## Steps to Run Locally

### Prerequisites

- Python 3.11+
- Node.js 18+
- npm or yarn

### Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`. Visit `http://localhost:8000/docs` for interactive Swagger documentation.

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`.

### Environment Variables

**Frontend** (`.env`):
```
VITE_API_URL=http://localhost:8000
```

**Backend**: No additional environment variables needed for local development. SQLite is used by default.

## Assumptions & Limitations

- **Single admin user** – No authentication/authorization is implemented as per requirements
- **SQLite** is used for local development; PostgreSQL is recommended for production
- **Leave management, payroll, and advanced HR features** are out of scope
- Attendance for the same employee + date combination updates the existing record (upsert behavior)
- Employee ID is manually assigned (not auto-generated) to allow custom ID schemes

## Deployment Notes

- Frontend is deployed on **Vercel** with automatic builds from the `frontend/` directory
- Backend is deployed on **Render** as a web service
- Set `VITE_API_URL` environment variable in Vercel to point to the deployed backend URL
- Set `DATABASE_URL` environment variable in Render for PostgreSQL connection (if using PostgreSQL)
