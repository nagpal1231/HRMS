from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import date
from typing import Optional

from .database import engine, get_db, Base
from .models import Employee, Attendance
from .schemas import (
    EmployeeCreate,
    EmployeeResponse,
    AttendanceCreate,
    AttendanceResponse,
    DashboardStats,
)

Base.metadata.create_all(bind=engine)

app = FastAPI(title="HRMS Lite API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Helper ────────────────────────────────────────────────
def _employee_to_response(emp: Employee, db: Session) -> EmployeeResponse:
    present = (
        db.query(Attendance)
        .filter(Attendance.employee_id == emp.id, Attendance.status == "Present")
        .count()
    )
    total = db.query(Attendance).filter(Attendance.employee_id == emp.id).count()
    return EmployeeResponse(
        id=emp.id,
        emp_id=emp.emp_id,
        name=emp.name,
        email=emp.email,
        department=emp.department,
        created_at=emp.created_at,
        present_days=present,
        total_days=total,
    )


# ─── Employee Endpoints ───────────────────────────────────
@app.get("/api/employees", response_model=list[EmployeeResponse])
def list_employees(db: Session = Depends(get_db)):
    employees = db.query(Employee).order_by(Employee.created_at.desc()).all()
    return [_employee_to_response(emp, db) for emp in employees]


@app.post("/api/employees", response_model=EmployeeResponse, status_code=201)
def create_employee(payload: EmployeeCreate, db: Session = Depends(get_db)):
    if db.query(Employee).filter(Employee.emp_id == payload.emp_id).first():
        raise HTTPException(
            status_code=409,
            detail=f"Employee ID '{payload.emp_id}' already exists.",
        )

    if db.query(Employee).filter(Employee.email == payload.email).first():
        raise HTTPException(
            status_code=409,
            detail=f"Email '{payload.email}' is already registered.",
        )

    employee = Employee(**payload.model_dump())
    db.add(employee)
    db.commit()
    db.refresh(employee)
    return _employee_to_response(employee, db)


@app.delete("/api/employees/{emp_id}", status_code=204)
def delete_employee(emp_id: str, db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.emp_id == emp_id).first()
    if not employee:
        raise HTTPException(
            status_code=404, detail=f"Employee '{emp_id}' not found."
        )
    db.delete(employee)
    db.commit()


# ─── Attendance Endpoints ─────────────────────────────────
@app.get("/api/attendance", response_model=list[AttendanceResponse])
def list_attendance(
    emp_id: Optional[str] = Query(None),
    date_filter: Optional[date] = Query(None, alias="date"),
    db: Session = Depends(get_db),
):
    query = db.query(Attendance).join(Employee)

    if emp_id:
        query = query.filter(Employee.emp_id == emp_id)
    if date_filter:
        query = query.filter(Attendance.date == date_filter)

    records = query.order_by(Attendance.date.desc(), Attendance.id.desc()).all()

    return [
        AttendanceResponse(
            id=r.id,
            date=r.date,
            status=r.status,
            employee_id=r.employee_id,
            emp_id=r.employee.emp_id,
            employee_name=r.employee.name,
        )
        for r in records
    ]


@app.post("/api/attendance", response_model=AttendanceResponse, status_code=201)
def mark_attendance(payload: AttendanceCreate, db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.emp_id == payload.emp_id).first()
    if not employee:
        raise HTTPException(
            status_code=404, detail=f"Employee '{payload.emp_id}' not found."
        )

    existing = (
        db.query(Attendance)
        .filter(Attendance.employee_id == employee.id, Attendance.date == payload.date)
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=409,
            detail=f"Attendance already marked for {payload.emp_id} on {payload.date}.",
        )

    record = Attendance(
        employee_id=employee.id,
        date=payload.date,
        status=payload.status,
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return AttendanceResponse(
        id=record.id,
        date=record.date,
        status=record.status,
        employee_id=record.employee_id,
        emp_id=employee.emp_id,
        employee_name=employee.name,
    )


# ─── Dashboard ────────────────────────────────────────────
@app.get("/api/dashboard", response_model=DashboardStats)
def dashboard_stats(db: Session = Depends(get_db)):
    total = db.query(Employee).count()
    today = date.today()
    present = (
        db.query(Attendance)
        .filter(Attendance.date == today, Attendance.status == "Present")
        .count()
    )
    absent = (
        db.query(Attendance)
        .filter(Attendance.date == today, Attendance.status == "Absent")
        .count()
    )
    rate = round((present / total) * 100) if total > 0 else 0

    return DashboardStats(
        total_employees=total,
        present_today=present,
        absent_today=absent,
        attendance_rate=rate,
    )


# ─── Health Check ─────────────────────────────────────────
@app.get("/api/health")
def health_check():
    return {"status": "healthy", "version": "1.0.0"}
