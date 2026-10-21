"""Запуск из корня: python3 -m unittest discover -s tests -v."""
import ast
import importlib.util
from pathlib import Path
import subprocess
import sys
import unittest
from decimal import Decimal

ROOT = Path(__file__).resolve().parents[1]
CASES = {
    'lab-01/low': [('5\n3\n', ['15.00', '16.00']), ('2.5\n4\n', ['10.00', '13.00']), ('1\n1\n', ['1.00', '4.00'])],
    'lab-01/medium': [('7384\n', ['2 ч 3 мин 4 сек']), ('0\n', ['0 ч 0 мин 0 сек']), ('86400\n', ['24 ч 0 мин 0 сек'])],
    'lab-01/high': [('3\n4\n', ['5.0000', '6.0000', '12.0000', '36.8699° и 53.1301°']), ('1\n1\n', ['1.4142', '0.5000', '3.4142', '45.0000° и 45.0000°']), ('5\n12\n', ['13.0000', '30.0000', '30.0000', '22.6199° и 67.3801°'])],
    'lab-02/low': [('1\n', ['2.0000', '6.2832', '3.1416']), ('2\n', ['4.0000', '12.5664', '12.5664']), ('0.5\n', ['1.0000', '3.1416', '0.7854'])],
    'lab-02/medium': [('1000\n3\n10\n', ['3000.00', '300.00', '2700.00']), ('250\n2\n0\n', ['500.00', '0.00', '500.00']), ('150\n4\n100\n', ['600.00', '600.00', '0.00'])],
    'lab-02/high': [('14\n35\n95\n', ['16:10', 'полночь: 0']), ('23\n50\n20\n', ['00:10', 'полночь: 1']), ('0\n0\n2881\n', ['00:01', 'полночь: 2'])],
}

def load(level):
    spec = importlib.util.spec_from_file_location('lab3_' + level, ROOT / 'lab-03' / level / 'main.py')
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module

class LinearPrograms(unittest.TestCase):
    def test_all_examples(self):
        for folder, examples in CASES.items():
            for inputs, expected in examples:
                with self.subTest(project=folder, inputs=inputs):
                    result = subprocess.run([sys.executable, str(ROOT / folder / 'main.py')], input=inputs, text=True, capture_output=True, check=True)
                    for value in expected:
                        self.assertIn(value, result.stdout)

    def test_linear_restrictions(self):
        forbidden = (ast.If, ast.IfExp, ast.For, ast.While, ast.List, ast.Dict, ast.Set, ast.Tuple, ast.ListComp, ast.DictComp, ast.SetComp, ast.GeneratorExp, ast.FunctionDef)
        for folder in CASES:
            tree = ast.parse((ROOT / folder / 'main.py').read_text())
            with self.subTest(project=folder):
                self.assertFalse(any(isinstance(node, forbidden) for node in ast.walk(tree)))

class StudentTests(unittest.TestCase):
    def setUp(self): self.Student = load('low').Student

    def test_three_independent_objects(self):
        students = [self.Student(name, 18, 'IT') for name in ['Алия','Данияр','Аружан']]
        students[0].change_specialty('Дизайн')
        self.assertEqual(students[0].specialty, 'Дизайн')
        self.assertEqual(students[1].specialty, 'IT')
        self.assertEqual(len({id(student) for student in students}), 3)

    def test_course_change(self):
        student = self.Student('Алия', 18, 'IT')
        student.advance_course()
        self.assertEqual(student.course, 2)
        self.assertIn('курс 2', student.get_info())

    def test_invalid_values(self):
        with self.assertRaises(ValueError): self.Student('', 18, 'IT')
        with self.assertRaises(ValueError): self.Student('Алия', -1, 'IT')
        with self.assertRaises(ValueError): self.Student('Алия', 18, 'IT', 6).advance_course()

class BankTests(unittest.TestCase):
    def setUp(self): self.Bank = load('medium').BankAccount

    def test_deposit_withdraw_exact_decimal(self):
        account = self.Bank('Алия', '0.10')
        account.deposit('0.20'); account.withdraw('0.10')
        self.assertEqual(account.get_balance(), Decimal('0.20'))
        self.assertEqual(len(account.get_statement()), 2)
        self.assertFalse(hasattr(account, '__balance'))

    def test_insufficient_funds_no_change(self):
        account = self.Bank('Алия', 100)
        with self.assertRaises(ValueError): account.withdraw(101)
        self.assertEqual(account.get_balance(), 100)
        self.assertEqual(account.get_statement(), ())

    def test_invalid_amount(self):
        account = self.Bank('Алия')
        for value in [-1, 0, 'NaN', 'Infinity', 'text', '0.001']:
            with self.subTest(value=value), self.assertRaises(ValueError): account.deposit(value)
        self.assertEqual(account.get_balance(), 0)

class WalletTests(unittest.TestCase):
    def setUp(self): self.Wallet = load('high').ElectronicWallet

    def test_transfer_conserves_funds(self):
        a, b = self.Wallet('Алия','1111',100), self.Wallet('Данияр','2222',50)
        a.transfer(b, '20.25','1111')
        self.assertEqual(a.get_balance('1111'), Decimal('79.75'))
        self.assertEqual(b.get_balance('2222'), Decimal('70.25'))
        self.assertEqual(len(a.get_history('1111')), 1)
        self.assertEqual(len(b.get_history('2222')), 1)

    def test_wrong_pin_no_mutation(self):
        a, b = self.Wallet('Алия','1111',100), self.Wallet('Данияр','2222')
        with self.assertRaises(PermissionError): a.transfer(b, 20, '0000')
        self.assertEqual(a.get_balance('1111'), 100)
        self.assertEqual(b.get_balance('2222'), 0)

    def test_invalid_transfers_no_mutation(self):
        a, b = self.Wallet('Алия','1111',100), self.Wallet('Данияр','2222',0,'USD')
        for recipient, amount in [(a, 1), (b,1), (object(),1), (b,101)]:
            with self.assertRaises(ValueError): a.transfer(recipient,amount,'1111')
        self.assertEqual(a.get_balance('1111'), 100)

    def test_pay_and_change_pin(self):
        a = self.Wallet('Алия','1111',100)
        a.deposit(20,'1111'); a.pay(30,'1111'); a.change_pin('1111','4444')
        self.assertFalse(a.check_pin('1111'))
        self.assertEqual(a.get_balance('4444'), 90)

    def test_insufficient_payment(self):
        a = self.Wallet('Алия','1111',100)
        with self.assertRaises(ValueError): a.pay(101,'1111')
        self.assertEqual(a.get_balance('1111'), 100)

if __name__ == '__main__':
    unittest.main()
