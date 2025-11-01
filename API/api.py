# student_management/main.py

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from main import StudentService

app = FastAPI(title="Student Management API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000","https://smart-student-management-system.vercel.app"],  # Vite and React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Pydantic models for validation
class Student(BaseModel):
    id: int
    name: str
    age: int
    grade: str
    marks: int


class StudentUpdate(BaseModel):
    name: str | None = None
    age: int | None = None
    grade: str | None = None
    marks: int | None = None


@app.post("/students")
def add_student(student: Student):
    return StudentService.add_student(
        student.id, student.name, student.age, student.grade, student.marks
    )


@app.get("/students")
def view_students():
    return StudentService.view_students()


@app.get("/students/search")
def search_student(by: str, value: str):
    return StudentService.search_student(by, value)


@app.put("/students/{id}")
def update_student(id: int, student: StudentUpdate):
    return StudentService.update_student(id, student.dict(exclude_unset=True))


@app.delete("/students/{id}")
def delete_student(id: int):
    return StudentService.delete_student(id)


@app.get("/students/analyze")
def analyze_data():
    return StudentService.analyze_data()
