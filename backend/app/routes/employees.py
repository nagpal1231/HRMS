from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app import crud, schemas

router = APIRouter(prefix="/api/employees", tags=["Employees"])


@router.get("/", response_model=list[schemas.EmployeeResponse])
def list_employees(db: Session = Depends(get_db)):
    employees = crud.get_employees(db)
    result = []
    for emp in employees:
        total_present = crud.count_employee_attendance(db, emp.employee_id, "Present")
        total_absent = crud.count_employee_attendance(db, emp.employee_id, "Absent")
        result.append(
            schemas.EmployeeResponse(
                employee_id=emp.employee_id,
                full_name=emp.full_name,
                email=emp.email,
                department=emp.department,
                total_present=total_present,
                total_absent=total_absent,
            )
        )
    return result


@router.get("/{employee_id}", response_model=schemas.EmployeeResponse)
def get_employee(employee_id: str, db: Session = Depends(get_db)):
    emp = crud.get_employee(db, employee_id)
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    total_present = crud.count_employee_attendance(db, emp.employee_id, "Present")
    total_absent = crud.count_employee_attendance(db, emp.employee_id, "Absent")
    return schemas.EmployeeResponse(
        employee_id=emp.employee_id,
        full_name=emp.full_name,
        email=emp.email,
        department=emp.department,
        total_present=total_present,
        total_absent=total_absent,
    )


@router.post("/", response_model=schemas.EmployeeResponse, status_code=201)
def create_employee(emp: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    # Check for duplicate employee ID
    existing = crud.get_employee(db, emp.employee_id)
    if existing:
        raise HTTPException(
            status_code=409,
            detail=f"Employee with ID '{emp.employee_id}' already exists",
        )
    # Check for duplicate email
    existing_email = crud.get_employee_by_email(db, emp.email)
    if existing_email:
        raise HTTPException(
            status_code=409,
            detail=f"Employee with email '{emp.email}' already exists",
        )
    created = crud.create_employee(db, emp)
    return schemas.EmployeeResponse(
        employee_id=created.employee_id,
        full_name=created.full_name,
        email=created.email,
        department=created.department,
        total_present=0,
        total_absent=0,
    )


@router.delete("/{employee_id}", status_code=204)
def delete_employee(employee_id: str, db: Session = Depends(get_db)):
    deleted = crud.delete_employee(db, employee_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Employee not found")
    return None
