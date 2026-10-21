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

function renderTable(number) {
  const table = document.createElement("table");
  table.append(element("caption", `Таблица умножения на ${number}`));
  for (let i = 1; i <= 10; i++) {
    const row = document.createElement("tr");
    row.append(element("td", `${number} × ${i}`), element("td", String(number * i)));
    table.append(row);
  }
  $("#result").replaceChildren(table);
}
$("form").addEventListener("submit", (event) => {
  event.preventDefault(); const value = Number($("#number").value);
  if (!Number.isInteger(value) || value < 1 || value > 10) {
    $("#result").replaceChildren(); message("Введите целое число от 1 до 10");
  } else { renderTable(value); message("Таблица построена", true); }
});
$("#number").addEventListener("input", () => { $("#result").replaceChildren(); message(""); });
$("#clear").addEventListener("click", () => { $("form").reset(); $("#result").replaceChildren(); message(""); $("#number").focus(); });
