# Предусловия: цена >= 0, количество — целое >= 0, скидка от 0 до 100.
price = float(input("Цена товара: "))
quantity = int(input("Количество: "))
discount_percent = float(input("Скидка, %: "))
subtotal = price * quantity
discount = subtotal * discount_percent / 100
total = subtotal - discount
print(f"Первоначальная стоимость: {subtotal:.2f}")
print(f"Сумма скидки: {discount:.2f}")
print(f"Итоговая стоимость: {total:.2f}")
