import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import ValidationError

from app.database import engine, Base
from app.routes import employees, attendance, dashboard

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="HRMS API",
    description="HRMS — A lightweight Human Resource Management System",
    version="1.0.0",
)

# CORS configuration
# Default origins include the deployed Vercel frontend and localhost for dev.
# Override via CORS_ORIGINS env var if needed.
default_origins = "https://sonia-staffly.vercel.app,http://localhost:5173,http://localhost:3000"
cors_env = os.getenv("CORS_ORIGINS", default_origins)
origins = [o.strip() for o in cors_env.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True if origins != ["*"] else False,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Include routers
app.include_router(employees.router)
app.include_router(attendance.router)
app.include_router(dashboard.router)


@app.get("/")
def root():
    return {"message": "HRMS API is running", "version": "1.0.0"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


# Global exception handlers
@app.exception_handler(ValidationError)
async def validation_exception_handler(request: Request, exc: ValidationError):
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors()},
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred"},
    )
