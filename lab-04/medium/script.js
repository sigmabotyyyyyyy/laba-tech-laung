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
  const prices = {book:2500, pen:500}, product = $("#product").value;
  const quantity = Number($("#quantity").value), delivery = $("input[name=delivery]:checked");
  const checks = [error("product", product in prices ? "" : "Выберите товар"), error("quantity", Number.isInteger(quantity) && quantity >= 1 && quantity <= 1000 ? "" : "Введите целое количество от 1 до 1000"), error("delivery", delivery ? "" : "Выберите доставку")];
  $("#summary").replaceChildren();
  if (checks.includes(false)) { message("Исправьте отмеченные поля"); return; }
  const total = prices[product] * quantity + (delivery.value === "courier" ? 1500 : 0) + ($("#gift").checked ? 300 : 0);
  $("#summary").append(element("h2", `Итого: ${total} ₸`), element("p", `Количество: ${quantity}; доставка: ${delivery.value === "courier" ? "курьер" : "самовывоз"}`));
  message("Заказ рассчитан", true);
});
