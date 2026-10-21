// Проверки JSON/Storage без сторонних зависимостей: node tests/test_storage.cjs
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const results = [];
for (const level of ['low', 'medium', 'high']) {
  const source = fs.readFileSync(path.join(__dirname, '..', 'lab-08', level, 'app.js'), 'utf8');
  const start = source.indexOf('function readStored');
  const end = source.indexOf('const ' + (level === 'high' ? 'DRAFT' : 'KEY'));
  const messages = [];
  const context = vm.createContext({message: (text) => messages.push(text)});
  vm.runInContext(source.slice(start, end), context);
  const checks = [
    ['Нет ключа', () => assert.deepEqual(context.readStored({getItem:()=>null}, 'x', [], Array.isArray), [])],
    ['Корректный JSON', () => assert.equal(JSON.stringify(context.readStored({getItem:()=>'["Книга"]'}, 'x', [], Array.isArray)), '["Книга"]')],
    ['Повреждённый JSON', () => assert.deepEqual(context.readStored({getItem:()=>'{broken'}, 'x', [], Array.isArray), [])],
    ['Неверная структура', () => assert.deepEqual(context.readStored({getItem:()=>'42'}, 'x', [], Array.isArray), [])],
    ['Storage недоступен', () => assert.deepEqual(context.readStored(null, 'x', [], Array.isArray), [])],
    ['Переполнение', () => assert.equal(context.writeStored({setItem:()=>{throw new Error('QuotaExceededError');}}, 'x', []), false)],
    ['Сериализация', () => { let stored; assert.equal(context.writeStored({setItem:(key,value)=>{stored = value;}}, 'x', [{text:'A'}]), true); assert.equal(stored, '[{"text":"A"}]'); }],
  ];
  for (const [name, check] of checks) { check(); results.push({project:`lab-08/${level}`, name, status:'passed'}); }
}
console.log(JSON.stringify(results, null, 2));
