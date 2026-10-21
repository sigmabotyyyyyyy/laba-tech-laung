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

const tags = new Set();
function count() { $("#counter").textContent = `Тегов: ${tags.size}`; }
$("form").addEventListener("submit", (event) => {
  event.preventDefault(); const text = $("#tag").value.trim(), key = text.toLocaleLowerCase();
  if (!text) { message("Тег не может быть пустым"); return; }
  if (tags.has(key)) { message("Такой тег уже существует"); return; }
  tags.add(key);
  const row = element("span", "", "badge");
  const remove = button("×", () => { tags.delete(key); row.remove(); count(); }, "secondary");
  remove.setAttribute("aria-label", `Удалить тег ${text}`);
  row.append(element("span", text + " "), remove); $("#list").append(row);
  $("#tag").value = ""; count(); message("Тег добавлен", true);
});
$("#tag").addEventListener("keydown", (event) => { if (event.key === "Escape") { $("#tag").value = ""; message(""); } });
