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

function tokens() { return $("#grades").value.trim().split(/[\s;]+/).filter(Boolean); }
$("#grades").addEventListener("input", () => { $("#count").textContent = `Введено оценок: ${tokens().length}`; $("#result").replaceChildren(); message(""); });
$("form").addEventListener("submit", (event) => {
  event.preventDefault(); const values = tokens().map((token) => Number(token.replace(",", ".")));
  $("#result").replaceChildren();
  if (!values.length || values.some((n) => !Number.isFinite(n) || n < 0 || n > 100)) { message("Введите оценки от 0 до 100 через пробел; десятичная часть через точку или запятую"); return; }
  let sum = 0; for (const value of values) sum += value;
  $("#result").append(element("p", `Средний балл: ${(sum / values.length).toFixed(2)}`, "stat"), element("p", `Минимум: ${Math.min(...values)} · Максимум: ${Math.max(...values)} · Количество: ${values.length}`));
  message("Расчёт выполнен", true);
});
