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

function calculate() {
  const prices = {standard:4000, vip:9000};
  return (prices[$("#category").value] + ($("#meal").checked ? 2000 : 0) + ($("#workshop").checked ? 3000 : 0)) * Number($("#quantity").value);
}
$("form").addEventListener("input", () => {
  const q = Number($("#quantity").value);
  $("#preview").textContent = $("#category").value && Number.isInteger(q) && q >= 1 && q <= 10 ? `Предварительно: ${calculate()} ₸` : "Выберите категорию и количество от 1 до 10";
});
$("form").addEventListener("submit", (event) => {
  event.preventDefault();
  const q = Number($("#quantity").value);
  const checks = [error("name", $("#name").value.trim() ? "" : "Введите ФИО"), error("email", validEmail($("#email").value.trim()) ? "" : "Введите корректный e-mail"), error("category", $("#category").value ? "" : "Выберите категорию"), error("quantity", Number.isInteger(q) && q >= 1 && q <= 10 ? "" : "Количество должно быть целым от 1 до 10"), error("agree", $("#agree").checked ? "" : "Подтвердите условия")];
  $("#summary").replaceChildren();
  if (checks.includes(false)) { message("Исправьте отмеченные поля"); return; }
  $("#summary").append(element("h2", `Итого: ${calculate()} ₸`), element("p", `${$("#name").value.trim()} · ${q} билетов · ${$("#email").value.trim()}`));
  message("Демонстрационная заявка готова", true);
});
