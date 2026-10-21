# Лабораторная 1, средний уровень, вариант 8.
# Предусловие: целое неотрицательное количество секунд.
total_seconds = int(input("Количество секунд: "))
hours = total_seconds // 3600
minutes = total_seconds % 3600 // 60
seconds = total_seconds % 60
print(f"Время: {hours} ч {minutes} мин {seconds} сек")
