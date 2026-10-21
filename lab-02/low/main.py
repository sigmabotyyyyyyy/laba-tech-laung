import math

# Предусловие: радиус — положительное число.
radius = float(input("Радиус круга: "))
diameter = 2 * radius
circumference = 2 * math.pi * radius
area = math.pi * radius ** 2
print(f"Диаметр: {diameter:.4f}")
print(f"Длина окружности: {circumference:.4f}")
print(f"Площадь: {area:.4f}")
