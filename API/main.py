# student_management/services/student_service.py

import os

DATA_FILE = "students.txt"


def validate_input(value, field_name, required=True, numeric=False):
    if not value and required:
        raise ValueError(f"{field_name} cannot be empty.")
    if numeric and value and not str(value).isdigit():
        raise ValueError(f"{field_name} must be a number.")
    return value.strip()


class StudentService:

    @staticmethod
    def add_student(id, name, age, grade, marks):
        id = validate_input(str(id), "Student ID", numeric=True)
        name = validate_input(name, "Name")
        age = validate_input(str(age), "Age", numeric=True)
        grade = validate_input(grade, "Grade")
        marks = validate_input(str(marks), "Marks", numeric=True)

        with open(DATA_FILE, "a") as file:
            file.write(f"{id},{name},{age},{grade},{marks}\n")

        return {"message": "Student added successfully"}

    @staticmethod
    def view_students():
        if not os.path.exists(DATA_FILE):
            return {"students": []}

        with open(DATA_FILE, "r") as file:
            students = file.readlines()

        result = []
        for student in students:
            id, name, age, grade, marks = student.strip().split(",")
            result.append({
                "id": int(id),
                "name": name,
                "age": int(age),
                "grade": grade,
                "marks": int(marks)
            })
        return {"students": result}

    @staticmethod
    def search_student(by: str, value: str):
        if not os.path.exists(DATA_FILE):
            return {"message": "No data file found"}

        with open(DATA_FILE, "r") as file:
            students = file.readlines()

        for student in students:
            id, name, age, grade, marks = student.strip().split(",")
            if by == "id" and id == value:
                return {"id": id, "name": name, "age": age, "grade": grade, "marks": marks}
            elif by == "name" and value.lower() in name.lower():
                return {"id": id, "name": name, "age": age, "grade": grade, "marks": marks}

        return {"message": "Student not found"}

    @staticmethod
    def update_student(id, new_data):
        if not os.path.exists(DATA_FILE):
            return {"message": "No data file found"}

        with open(DATA_FILE, "r") as file:
            students = file.readlines()

        for i, student in enumerate(students):
            sid, name, age, grade, marks = student.strip().split(",")
            if sid == str(id):
                name = new_data.get("name", name)
                age = new_data.get("age", age)
                grade = new_data.get("grade", grade)
                marks = new_data.get("marks", marks)
                students[i] = f"{sid},{name},{age},{grade},{marks}\n"
                with open(DATA_FILE, "w") as file:
                    file.writelines(students)
                return {"message": "Student record updated successfully"}

        return {"message": "Student not found"}

    @staticmethod
    def delete_student(id):
        if not os.path.exists(DATA_FILE):
            return {"message": "No data file found"}

        with open(DATA_FILE, "r") as file:
            students = file.readlines()

        original_count = len(students)
        students = [s for s in students if s.strip().split(",")[0] != str(id)]

        if len(students) == original_count:
            return {"message": "Student not found"}

        with open(DATA_FILE, "w") as file:
            file.writelines(students)

        return {"message": "Student deleted successfully"}

    @staticmethod
    def analyze_data():
        if not os.path.exists(DATA_FILE):
            return {"message": "No data available"}

        with open(DATA_FILE, "r") as file:
            students = file.readlines()

        if not students:
            return {"message": "No student records found"}

        marks = [int(s.strip().split(",")[-1]) for s in students]
        avg = sum(marks) / len(marks)
        highest = max(marks)
        lowest = min(marks)

        top_student = max(students, key=lambda s: int(s.strip().split(",")[-1]))
        top_name, top_marks = top_student.strip().split(",")[1], int(top_student.strip().split(",")[-1])

        below_avg = sum(1 for s in marks if s < avg)

        return {
            "average_marks": avg,
            "highest_marks": highest,
            "lowest_marks": lowest,
            "top_performer": {"name": top_name, "marks": top_marks},
            "below_average_count": below_avg
        }
