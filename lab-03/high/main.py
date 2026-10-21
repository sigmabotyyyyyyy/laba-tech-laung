from decimal import Decimal, InvalidOperation

def money(value, allow_zero=False):
    """Проверяет сумму и сохраняет точность до тиына (два знака)."""
    try:
        amount = Decimal(str(value))
    except (InvalidOperation, ValueError):
        raise ValueError("Введите числовую сумму") from None
    if not amount.is_finite() or amount < 0 or (amount == 0 and not allow_zero):
        raise ValueError("Сумма должна быть положительной и конечной")
    if amount != amount.quantize(Decimal("0.01")):
        raise ValueError("Допускается не более двух знаков после запятой")
    return amount.quantize(Decimal("0.01"))


class ElectronicWallet:
    """Учебный кошелёк. Не является платёжной системой."""
    def __init__(self, owner, pin, balance=0, currency="KZT"):
        self._validate_pin(pin)
        if not owner.strip():
            raise ValueError("Укажите владельца")
        self.owner = owner.strip()
        self.currency = currency
        self.__pin = pin
        self.__balance = money(balance, allow_zero=True)
        self.__history = []

    @staticmethod
    def _validate_pin(pin):
        if not isinstance(pin, str) or len(pin) != 4 or not pin.isascii() or not pin.isdigit():
            raise ValueError("PIN должен содержать ровно четыре цифры")

    def check_pin(self, pin):
        return self.__pin == pin

    def _authorize(self, pin):
        if not self.check_pin(pin):
            raise PermissionError("Неверный PIN")

    def get_balance(self, pin):
        self._authorize(pin)
        return self.__balance

    def deposit(self, amount, pin):
        self._authorize(pin)
        amount = money(amount)
        self.__balance += amount
        self.__history.append(f"Пополнение +{amount}")

    def pay(self, amount, pin):
        self._authorize(pin)
        amount = money(amount)
        if amount > self.__balance:
            raise ValueError("Недостаточно средств")
        self.__balance -= amount
        self.__history.append(f"Оплата -{amount}")

    def transfer(self, recipient, amount, pin):
        self._authorize(pin)
        amount = money(amount)
        if not isinstance(recipient, ElectronicWallet) or recipient is self:
            raise ValueError("Нужен другой кошелёк получателя")
        if recipient.currency != self.currency:
            raise ValueError("Валюты кошельков должны совпадать")
        if amount > self.__balance:
            raise ValueError("Недостаточно средств")
        # Все проверки завершены до изменения двух балансов.
        self.__balance -= amount
        recipient.__balance += amount
        self.__history.append(f"Перевод {recipient.owner}: -{amount}")
        recipient.__history.append(f"Перевод от {self.owner}: +{amount}")

    def get_history(self, pin):
        self._authorize(pin)
        return tuple(self.__history)

    def change_pin(self, old_pin, new_pin):
        self._authorize(old_pin)
        self._validate_pin(new_pin)
        self.__pin = new_pin

def main():
    # Вымышленные демонстрационные PIN, не реальные секреты.
    first = ElectronicWallet("Алия", "1111", 10000)
    second = ElectronicWallet("Данияр", "2222", 2000)
    third = ElectronicWallet("Аружан", "3333", 500)
    first.deposit(500, "1111")
    first.pay(1000, "1111")
    first.transfer(second, 2500, "1111")
    second.transfer(third, 300, "2222")
    for wallet, pin in [(first, "1111"), (second, "2222"), (third, "3333")]:
        print(wallet.owner, wallet.get_balance(pin), wallet.currency)
        print(*wallet.get_history(pin), sep="\n")

if __name__ == "__main__":
    main()
