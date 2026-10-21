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

// Каждый проект использует собственный ключ, чтобы данные не пересекались.
function readStored(storage, key, fallback, validate) {
  try {
    const raw = storage.getItem(key);
    if (raw === null) return fallback;
    const parsed = JSON.parse(raw);
    if (!validate(parsed)) throw new Error("Неверная структура JSON");
    return parsed;
  } catch { message("Сохранённые данные недоступны или повреждены. Используется пустое состояние."); return fallback; }
}
function writeStored(storage, key, data) {
  try { storage.setItem(key, JSON.stringify(data)); return true; }
  catch { message("Не удалось сохранить: хранилище недоступно или заполнено."); return false; }
}
function exportJSON(data, filename) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], {type:"application/json"}));
  const link = document.createElement("a"); link.href = url; link.download = filename; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
// Получение самого объекта Storage тоже может бросить SecurityError.
function storageOrNull(type) { try { return window[type]; } catch { return null; } }

const KEY = "lab8_low_shopping_v1", storage = storageOrNull("localStorage");
let items = readStored(storage, KEY, [], (data) => Array.isArray(data) && data.every((item) => typeof item === "string" && item.trim() && item.length <= 100));
function render() {
  $("#list").replaceChildren();
  items.forEach((item, index) => {
    const row = element("div", "", "item");
    row.append(element("span", item, "text"), button("Удалить", () => {
      const next = items.filter((_, i) => i !== index);
      if (writeStored(storage, KEY, next)) { items = next; render(); message("Товар удалён", true); }
    }, "danger")); $("#list").append(row);
  });
  if (!items.length) $("#list").append(element("p", "Список покупок пуст", "empty"));
}
$("form").addEventListener("submit", (event) => {
  event.preventDefault(); const text = $("#item").value.trim();
  if (!text) { message("Введите название товара"); return; }
  const next = [...items, text];
  if (writeStored(storage, KEY, next)) { items = next; $("#item").value = ""; render(); message("Товар сохранён", true); }
});
$("#export").addEventListener("click", () => exportJSON(items, "shopping.json")); render();
