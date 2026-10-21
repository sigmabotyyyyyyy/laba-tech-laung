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


class BankAccount:
    def __init__(self, owner, balance=0, currency="KZT"):
        if not owner.strip():
            raise ValueError("Укажите владельца")
        self.owner = owner.strip()
        self.currency = currency
        self.__balance = money(balance, allow_zero=True)
        self.__history = []

    def get_balance(self):
        return self.__balance

    def deposit(self, amount):
        amount = money(amount)
        self.__balance += amount
        self.__history.append(f"Пополнение +{amount} {self.currency}")

    def withdraw(self, amount):
        amount = money(amount)
        if amount > self.__balance:
            raise ValueError("Недостаточно средств")
        self.__balance -= amount
        self.__history.append(f"Снятие -{amount} {self.currency}")

    def get_statement(self):
        return tuple(self.__history)

def main():
    accounts = [BankAccount("Алия", 10000), BankAccount("Данияр", 5000), BankAccount("Аружан")]
    for account in accounts:
        account.deposit("500.50")
        account.withdraw("100.25")
        print(account.owner, account.get_balance(), account.currency)
        print(*account.get_statement(), sep="\n")

if __name__ == "__main__":
    main()
