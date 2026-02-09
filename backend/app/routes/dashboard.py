from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date

from app.database import get_db
from app import crud, schemas

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("/", response_model=schemas.DashboardResponse)
def get_dashboard(db: Session = Depends(get_db)):
    today = date.today()
    return schemas.DashboardResponse(
        total_employees=crud.count_employees(db),
        total_present_today=crud.count_attendance_by_status(db, today, "Present"),
        total_absent_today=crud.count_attendance_by_status(db, today, "Absent"),
        department_count=crud.count_departments(db),
    )
