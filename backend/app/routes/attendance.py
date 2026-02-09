from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import date
from typing import Optional

from app.database import get_db
from app import crud, schemas

router = APIRouter(prefix="/api/attendance", tags=["Attendance"])


@router.post("/", response_model=schemas.AttendanceResponse, status_code=201)
def mark_attendance(att: schemas.AttendanceCreate, db: Session = Depends(get_db)):
    # Verify employee exists
    employee = crud.get_employee(db, att.employee_id)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    record = crud.create_or_update_attendance(db, att)
    return schemas.AttendanceResponse(
        id=record.id,
        employee_id=record.employee_id,
        date=record.date,
        status=record.status,
        employee_name=employee.full_name,
    )


@router.get("/employee/{employee_id}", response_model=list[schemas.AttendanceResponse])
def get_employee_attendance(
    employee_id: str,
    date_filter: Optional[date] = Query(None, alias="date"),
    db: Session = Depends(get_db),
):
    employee = crud.get_employee(db, employee_id)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    records = crud.get_attendance_by_employee(db, employee_id, date_filter)
    return [
        schemas.AttendanceResponse(
            id=r.id,
            employee_id=r.employee_id,
            date=r.date,
            status=r.status,
            employee_name=employee.full_name,
        )
        for r in records
    ]


@router.get("/date/{target_date}", response_model=list[schemas.AttendanceResponse])
def get_attendance_by_date(target_date: date, db: Session = Depends(get_db)):
    records = crud.get_attendance_by_date(db, target_date)
    result = []
    for r in records:
        emp = crud.get_employee(db, r.employee_id)
        result.append(
            schemas.AttendanceResponse(
                id=r.id,
                employee_id=r.employee_id,
                date=r.date,
                status=r.status,
                employee_name=emp.full_name if emp else None,
            )
        )
    return result
