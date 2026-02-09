from pydantic import BaseModel, EmailStr, field_validator
from datetime import date
from typing import Optional, Literal


class EmployeeCreate(BaseModel):
    employee_id: str
    full_name: str
    email: EmailStr
    department: str

    @field_validator("employee_id")
    @classmethod
    def employee_id_not_empty(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Employee ID is required")
        if len(v) > 50:
            raise ValueError("Employee ID must be 50 characters or less")
        return v

    @field_validator("full_name")
    @classmethod
    def full_name_not_empty(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Full name is required")
        if len(v) > 100:
            raise ValueError("Full name must be 100 characters or less")
        return v

    @field_validator("department")
    @classmethod
    def department_not_empty(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Department is required")
        if len(v) > 100:
            raise ValueError("Department must be 100 characters or less")
        return v


class EmployeeResponse(BaseModel):
    employee_id: str
    full_name: str
    email: str
    department: str
    total_present: int = 0
    total_absent: int = 0

    class Config:
        from_attributes = True


class AttendanceCreate(BaseModel):
    employee_id: str
    date: date
    status: Literal["Present", "Absent"]

    @field_validator("employee_id")
    @classmethod
    def employee_id_not_empty(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Employee ID is required")
        return v


class AttendanceResponse(BaseModel):
    id: str
    employee_id: str
    date: date
    status: str
    employee_name: Optional[str] = None

    class Config:
        from_attributes = True


class DashboardResponse(BaseModel):
    total_employees: int
    total_present_today: int
    total_absent_today: int
    department_count: int
