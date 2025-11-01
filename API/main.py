# student_management/services/student_service.py

import os

DATA_FILE = "students.txt"


def id_exists(student_id):
    if not os.path.exists(DATA_FILE):
        return False
    with open(DATA_FILE, "r") as f:
        for line in f:
            parts = line.strip().split(",")
            if len(parts) >= 1 and parts[0].strip() == str(student_id).strip():
                return True
    return False


def validate_input(value, field_name):
    value = value.strip()

    if field_name == "ID":
        if not value.isdigit():
            print("ID must be a numbr")
            return None
        if id_exists(value):
            print("ID alreaddy exists")
            return None

    elif field_name == "Name":
        if not value or value.isdigit():
            print("Name cant be empty or numeric")
            return None

    elif field_name == "Age":
        if not value.isdigit() or int(value) <= 0:
            print("Age must be a postive number")
            return None

    elif field_name == "Grade":
        if len(value) != 1 or value.upper() not in "ABCDEF":
            print("Grade must be one letter (A–F)")
            return None
        value = value.upper()

    elif field_name == "Marks":
        if not value.isdigit() or not (0 <= int(value) <= 100):
            print("Marks should be between 0 and 100")
            return None

    return value


class StudentService:

    @staticmethod
    def add_student():
        print("\n-- Add New Student --")
        while True:
            id = validate_input(input("Enter studet id: "), "ID")
            if id: break

        while True:
            name = validate_input(input("Enter studet name: "), "Name")
            if name: break

        while True:
            age = validate_input(input("Enter studet age: "), "Age")
            if age: break

        while True:
            grade = validate_input(input("Enter grade (A-F): "), "Grade")
            if grade: break

        while True:
            marks = validate_input(input("Enter marks: "), "Marks")
            if marks: break

        with open(DATA_FILE, "a") as file:
            file.write(f"{id},{name},{age},{grade},{marks}\n")

        print("student addd successfully!")

    @staticmethod
    def view_students():
        print("\n--- all students ---")
        if not os.path.exists(DATA_FILE):
            print("no studentt data found yet.")
            return

        with open(DATA_FILE, "r") as file:
            students = file.readlines()

        if not students:
            print("file is empty, add some students first.")
            return

        for student in students:
            id, name, age, grade, marks = student.strip().split(",")
            print(f"ID: {id} | Name: {name} | Age: {age} | Grade: {grade} | Marks: {marks}")

    @staticmethod
    def search_student():
        print("\n-- search student --")
        search_by = input("Search by (1) ID or (2) Name: ").strip()

        if search_by == "1":
            user_id = input("Enter studentt ID to search: ").strip()
        elif search_by == "2":
            user_name = input("Enter student namee to search: ").strip().lower()
        else:
            print("invalid choice, please enter 1 or 2.")
            return

        if not os.path.exists(DATA_FILE):
            print("no data file found.")
            return

        found = False
        with open(DATA_FILE, "r") as file:
            for line in file:
                id, name, age, grade, marks = line.strip().split(",")
                if search_by == "1" and id.strip() == user_id:
                    print(f"Found: ID={id}, Name={name}, Age={age}, Grade={grade}, Marks={marks}")
                    found = True
                    break
                elif search_by == "2" and user_name in name.lower():
                    print(f"Found: ID={id}, Name={name}, Age={age}, Grade={grade}, Marks={marks}")
                    found = True
                    break

        if not found:
            print("student not found.")

    @staticmethod
    def update_student():
        print("\n-- update student infoo --")
        user_id = input("Enter ID to update: ").strip()

        if not os.path.exists(DATA_FILE):
            print("file not found.")
            return

        with open(DATA_FILE, "r") as file:
            students = file.readlines()

        for i, student in enumerate(students):
            id, name, age, grade, marks = student.strip().split(",")
            if id.strip() == user_id:
                print(f"Editing student: {name} ({id})")

                new_name = input("New name (leave empty to keep): ").strip()
                new_age = input("New age (leave empty to keep): ").strip()
                new_grade = input("New grade (leave empty to keep): ").strip()
                new_marks = input("New marks (leave empty to keep): ").strip()

                if new_name:
                    name = new_name
                if new_age:
                    age = new_age
                if new_grade:
                    grade = new_grade
                if new_marks:
                    marks = new_marks

                students[i] = f"{id},{name},{age},{grade},{marks}\n"
                with open(DATA_FILE, "w") as file:
                    file.writelines(students)

                print("record updated successfully.")
                return
        print("student not found.")

    @staticmethod
    def analyze_data():
        print("\n-- analyzing student datae --")
        if not os.path.exists(DATA_FILE):
            print("file not found.")
            return

        with open(DATA_FILE, "r") as file:
            students = file.readlines()

        if not students:
            print("no data to analyze.")
            return

        marks = [int(s.strip().split(",")[-1]) for s in students]
        avg = sum(marks) / len(marks)
        highest = max(marks)
        lowest = min(marks)

        top_student = max(students, key=lambda s: int(s.strip().split(",")[-1]))
        top_name = top_student.strip().split(",")[1]
        top_marks = int(top_student.strip().split(",")[-1])

        below_avg = len([m for m in marks if m < avg])

        print(f"Average Marks: {avg:.2f}")
        print(f"Top Performer: {top_name} ({top_marks})")
        print(f"Below Average Students: {below_avg}")
        print(f"Highest: {highest} | Lowest: {lowest}")
