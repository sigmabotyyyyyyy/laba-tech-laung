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

function error(id, text) {
  $("#" + id + "-error").textContent = text;
  $("#" + id).setAttribute("aria-invalid", String(Boolean(text)));
  return !text;
}
function validEmail(value) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); }
$("form").addEventListener("input", () => { $("#summary").replaceChildren(); message(""); });

$("form").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = $("#name").value.trim(), email = $("#email").value.trim();
  const checks = [error("name", name ? "" : "Введите ФИО"), error("email", validEmail(email) ? "" : "Введите корректный e-mail"), error("course", $("#course").value ? "" : "Выберите курс"), error("agree", $("#agree").checked ? "" : "Подтвердите согласие")];
  $("#summary").replaceChildren();
  if (checks.includes(false)) { message("Исправьте отмеченные поля"); return; }
  $("#summary").append(element("h2", "Анкета готова"), element("p", `${name} · ${email} · ${$("#course").value} курс`));
  message("Форма заполнена корректно", true);
});
