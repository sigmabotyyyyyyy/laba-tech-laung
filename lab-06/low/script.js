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

function updateCount() {
  const count = $("#list").children.length;
  $("#count").textContent = String(count); $("#empty").hidden = count !== 0;
}
$("#note").addEventListener("input", () => { $("#counter").textContent = `${$("#note").value.length} / 500`; });
$("form").addEventListener("submit", (event) => {
  event.preventDefault(); const text = $("#note").value.trim();
  if (!text) { message("Введите текст заметки"); return; }
  const row = element("div", "", "item");
  row.append(element("span", text, "text"), button("Удалить", () => { row.remove(); updateCount(); message("Заметка удалена", true); }, "danger"));
  $("#list").append(row); $("#note").value = ""; $("#counter").textContent = "0 / 500"; updateCount(); message("Заметка добавлена", true);
});
