import math

# Предусловие: оба катета положительны, единицы измерения одинаковы.
leg_a = float(input("Первый катет: "))
leg_b = float(input("Второй катет: "))
hypotenuse = math.hypot(leg_a, leg_b)
area = leg_a * leg_b / 2
perimeter = leg_a + leg_b + hypotenuse
angle_a = math.degrees(math.atan2(leg_a, leg_b))
angle_b = 90 - angle_a
print(f"Гипотенуза: {hypotenuse:.4f}")
print(f"Площадь: {area:.4f}")
print(f"Периметр: {perimeter:.4f}")
print(f"Углы: {angle_a:.4f}° и {angle_b:.4f}°")
