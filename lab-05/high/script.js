"use strict";
const $ = (selector) => document.querySelector(selector);
function element(tag, text, className = "") {
  const node = document.createElement(tag);
  node.textContent = text;
  if (className) node.className = className;
  return node;
}
function button(text, action, className = "secondary") {
  const node = element("button", text, className);
  node.type = "button";
  node.addEventListener("click", action);
  return node;
}
function message(text, success = false) {
  $("#message").textContent = text;
  $("#message").className = success ? "message success" : "message error";
}

let expenses = [], nextId = 1;
function render() {
  $("#list").replaceChildren(); let total = 0, visible = 0;
  const query = $("#search").value.trim().toLocaleLowerCase();
  for (const expense of expenses) {
    total += expense.cents;
    if (!expense.name.toLocaleLowerCase().includes(query)) continue;
    visible++;
    const row = element("div", "", "item");
    row.append(element("span", `${expense.name} — ${(expense.cents / 100).toFixed(2)} ₸`, "text"), button("Удалить", () => { expenses = expenses.filter((item) => item.id !== expense.id); render(); }, "danger"));
    $("#list").append(row);
  }
  $("#total").textContent = `Общий расход: ${(total / 100).toFixed(2)} ₸`;
  if (!visible) $("#list").append(element("p", "Расходы не найдены", "empty"));
}
$("form").addEventListener("submit", (event) => {
  event.preventDefault(); const name = $("#name").value.trim(), amount = Number($("#amount").value);
  if (!name || !Number.isFinite(amount) || amount <= 0 || amount > 1e9 || Math.abs(amount * 100 - Math.round(amount * 100)) > 0.0001) { message("Укажите название и сумму от 0.01 до 1 000 000 000 с двумя десятичными знаками максимум"); return; }
  expenses.push({id:nextId++, name, cents:Math.round(amount * 100)}); $("form").reset(); render(); message("Расход добавлен", true);
});
$("#search").addEventListener("input", render); render();
