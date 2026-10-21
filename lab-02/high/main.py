# Предусловия: часы 0..23, минуты 0..59, длительность — целое >= 0.
start_hour = int(input("Час начала (0–23): "))
start_minute = int(input("Минута начала (0–59): "))
duration = int(input("Продолжительность в минутах: "))
total_minutes = start_hour * 60 + start_minute + duration
end_hour = total_minutes // 60 % 24
end_minute = total_minutes % 60
days = total_minutes // (24 * 60)
print(f"Время окончания: {end_hour:02d}:{end_minute:02d}")
print(f"Переходов через полночь: {days}")
