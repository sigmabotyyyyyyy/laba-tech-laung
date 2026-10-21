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

let tasks = [], nextId = 1;
const statuses = ["Новые", "В работе", "Готово"];
function render() {
  $("#board").replaceChildren();
  statuses.forEach((status, index) => {
    const column = element("section", "", "column");
    column.append(element("h2", `${status} (${tasks.filter((task) => task.status === index).length})`));
    const visible = tasks.filter((task) => task.status === index && task.text.toLocaleLowerCase().includes($("#search").value.trim().toLocaleLowerCase()));
    for (const task of visible) {
      const card = element("article", "", "card"); card.append(element("p", task.text));
      if (index > 0) card.append(button("← Назад", () => { task.status--; render(); }));
      if (index < 2) card.append(button("Далее →", () => { task.status++; render(); }));
      card.append(button("Удалить", () => { tasks = tasks.filter((item) => item.id !== task.id); render(); }, "danger")); column.append(card);
    }
    if (!visible.length) column.append(element("p", "Нет карточек", "empty"));
    $("#board").append(column);
  });
}
$("form").addEventListener("submit", (event) => {
  event.preventDefault(); const text = $("#task").value.trim();
  if (!text) { message("Введите название задачи"); return; }
  tasks.push({id:nextId++, text, status:0}); $("#task").value = ""; render(); message("Карточка добавлена", true);
});
$("#search").addEventListener("input", render); render();
