class Student:
    """Студент: данные экземпляра и методы изменения состояния."""

    def __init__(self, name, age, specialty, course=1):
        if not name.strip() or not specialty.strip():
            raise ValueError("Имя и специальность обязательны")
        if type(age) is not int or not 1 <= age <= 120:
            raise ValueError("Возраст должен быть целым от 1 до 120")
        if type(course) is not int or not 1 <= course <= 6:
            raise ValueError("Курс должен быть целым от 1 до 6")
        self.name = name.strip()
        self.age = age
        self.specialty = specialty.strip()
        self.course = course

    def get_info(self):
        return f"{self.name}, {self.age} лет, {self.specialty}, курс {self.course}"

    def print_info(self):
        print(self.get_info())

    def change_specialty(self, specialty):
        if not specialty.strip():
            raise ValueError("Специальность не может быть пустой")
        self.specialty = specialty.strip()

    def advance_course(self):
        if self.course >= 6:
            raise ValueError("Последний курс уже достигнут")
        self.course += 1

def main():
    students = [Student("Алия", 18, "Информатика"),
                Student("Данияр", 19, "Математика"),
                Student("Аружан", 20, "Дизайн", 2)]
    for student in students:
        student.print_info()
    students[0].change_specialty("Программная инженерия")
    students[0].advance_course()
    print("После изменения:")
    students[0].print_info()

if __name__ == "__main__":
    main()
