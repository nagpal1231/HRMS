from pydantic import BaseModel, EmailStr, field_validator
from datetime import date, datetime


class EmployeeCreate(BaseModel):
    emp_id: str
    name: str
    email: EmailStr
    department: str

    @field_validator("emp_id", "name", "department")
    @classmethod
    def not_empty(cls, v, info):
        if not v or not v.strip():
            raise ValueError(f"{info.field_name} cannot be empty")
        return v.strip()

    @field_validator("email")
    @classmethod
    def email_not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError("email cannot be empty")
        return v.strip().lower()


class EmployeeResponse(BaseModel):
    id: int
    emp_id: str
    name: str
    email: str
    department: str
    created_at: datetime
    present_days: int = 0
    total_days: int = 0

    class Config:
        from_attributes = True


class AttendanceCreate(BaseModel):
    emp_id: str
    date: date
    status: str

    @field_validator("status")
    @classmethod
    def validate_status(cls, v):
        if v not in ("Present", "Absent"):
            raise ValueError('Status must be "Present" or "Absent"')
        return v

    @field_validator("emp_id")
    @classmethod
    def emp_id_not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError("emp_id cannot be empty")
        return v.strip()


class AttendanceResponse(BaseModel):
    id: int
    date: date
    status: str
    employee_id: int
    emp_id: str
    employee_name: str

    class Config:
        from_attributes = True


class DashboardStats(BaseModel):
    total_employees: int
    present_today: int
    absent_today: int
    attendance_rate: int
