from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date
from typing import Optional
import uuid

from app.models import Employee, Attendance
from app.schemas import EmployeeCreate, AttendanceCreate


# ─── Employee CRUD ────────────────────────────────────────────

def get_employees(db: Session) -> list[Employee]:
    return db.query(Employee).order_by(Employee.full_name).all()


def get_employee(db: Session, employee_id: str) -> Optional[Employee]:
    return db.query(Employee).filter(Employee.employee_id == employee_id).first()


def get_employee_by_email(db: Session, email: str) -> Optional[Employee]:
    return db.query(Employee).filter(Employee.email == email).first()


def create_employee(db: Session, emp: EmployeeCreate) -> Employee:
    db_employee = Employee(
        employee_id=emp.employee_id,
        full_name=emp.full_name,
        email=emp.email,
        department=emp.department,
    )
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee


def delete_employee(db: Session, employee_id: str) -> bool:
    employee = get_employee(db, employee_id)
    if not employee:
        return False
    db.delete(employee)
    db.commit()
    return True


def count_employees(db: Session) -> int:
    return db.query(func.count(Employee.employee_id)).scalar()


def count_departments(db: Session) -> int:
    return db.query(func.count(func.distinct(Employee.department))).scalar()


# ─── Attendance CRUD ──────────────────────────────────────────

def get_attendance_by_employee(
    db: Session,
    employee_id: str,
    filter_date: Optional[date] = None,
) -> list[Attendance]:
    q = db.query(Attendance).filter(Attendance.employee_id == employee_id)
    if filter_date:
        q = q.filter(Attendance.date == filter_date)
    return q.order_by(Attendance.date.desc()).all()


def get_attendance_by_date(db: Session, target_date: date) -> list[Attendance]:
    return (
        db.query(Attendance)
        .filter(Attendance.date == target_date)
        .order_by(Attendance.employee_id)
        .all()
    )


def get_attendance_record(db: Session, employee_id: str, target_date: date) -> Optional[Attendance]:
    return (
        db.query(Attendance)
        .filter(Attendance.employee_id == employee_id, Attendance.date == target_date)
        .first()
    )


def create_or_update_attendance(db: Session, att: AttendanceCreate) -> Attendance:
    existing = get_attendance_record(db, att.employee_id, att.date)
    if existing:
        existing.status = att.status
        db.commit()
        db.refresh(existing)
        return existing
    db_attendance = Attendance(
        id=str(uuid.uuid4()),
        employee_id=att.employee_id,
        date=att.date,
        status=att.status,
    )
    db.add(db_attendance)
    db.commit()
    db.refresh(db_attendance)
    return db_attendance


def count_attendance_by_status(db: Session, target_date: date, status: str) -> int:
    return (
        db.query(func.count(Attendance.id))
        .filter(Attendance.date == target_date, Attendance.status == status)
        .scalar()
    )


def count_employee_attendance(db: Session, employee_id: str, status: str) -> int:
    return (
        db.query(func.count(Attendance.id))
        .filter(Attendance.employee_id == employee_id, Attendance.status == status)
        .scalar()
    )
