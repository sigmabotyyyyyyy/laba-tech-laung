# Лабораторная 1, базовый уровень, вариант 2.
# Предусловие: длина и ширина — положительные числа.
length = float(input("Длина прямоугольника: "))
width = float(input("Ширина прямоугольника: "))
area = length * width
perimeter = 2 * (length + width)
print(f"Площадь: {area:.2f}")
print(f"Периметр: {perimeter:.2f}")
