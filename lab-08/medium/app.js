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

const KEY = "lab8_medium_tasks_v1", storage = storageOrNull("localStorage");
function validTasks(data) { return Array.isArray(data) && data.every((item) => item && typeof item.id === "string" && typeof item.text === "string" && item.text.trim() && item.text.length <= 160 && typeof item.done === "boolean") && new Set(data.map((item) => item.id)).size === data.length; }
let tasks = readStored(storage, KEY, [], validTasks);
function update(next) { if (writeStored(storage, KEY, next)) { tasks = next; render(); message("Изменения сохранены", true); return true; } return false; }
function render() {
  $("#list").replaceChildren();
  $("#count").textContent = `Всего: ${tasks.length} · Выполнено: ${tasks.filter((task) => task.done).length}`;
  const filter = $("#filter").value;
  const visible = tasks.filter((task) => filter === "all" || task.done === (filter === "done"));
  for (const task of visible) {
    const row = element("div", "", "item" + (task.done ? " done" : ""));
    const toggle = document.createElement("input"); toggle.type = "checkbox"; toggle.checked = task.done; toggle.setAttribute("aria-label", `Выполнено: ${task.text}`);
    toggle.addEventListener("change", () => { if (!update(tasks.map((item) => item.id === task.id ? {...item,done:toggle.checked} : item))) toggle.checked = task.done; });
    row.append(toggle, element("span", task.text, "text"), button("Удалить", () => update(tasks.filter((item) => item.id !== task.id)), "danger")); $("#list").append(row);
  }
  if (!visible.length) $("#list").append(element("p", "Нет задач для этого фильтра", "empty"));
}
$("form").addEventListener("submit", (event) => {
  event.preventDefault(); const text = $("#task").value.trim();
  if (!text) { message("Введите текст задачи"); return; }
  if (update([...tasks, {id:crypto.randomUUID(),text,done:false}])) $("#task").value = "";
});
$("#filter").addEventListener("change", render); $("#export").addEventListener("click", () => exportJSON(tasks, "tasks.json")); render();
