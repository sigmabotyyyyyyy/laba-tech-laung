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

const DRAFT = "lab8_high_draft_v1", SAVED = "lab8_high_applications_v1";
const local = storageOrNull("localStorage"), session = storageOrNull("sessionStorage");
const blank = () => ({step:0,name:"",email:"",direction:"",motivation:"",agree:false,id:crypto.randomUUID()});
function validDraft(data) {
  return data && Number.isInteger(data.step) && data.step >= 0 && data.step <= 2 && typeof data.id === "string" && [data.name,data.email,data.direction,data.motivation].every((value) => typeof value === "string") && ["","web","python"].includes(data.direction) && typeof data.agree === "boolean";
}
function validApplication(data) { return validDraft(data) && data.name.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) && data.direction && data.motivation.trim().length >= 20 && data.agree && typeof data.created === "string"; }
let draft = readStored(session, DRAFT, blank(), validDraft);
let applications = readStored(local, SAVED, [], (data) => Array.isArray(data) && data.every(validApplication) && new Set(data.map((item) => item.id)).size === data.length);
function fill() { for (const id of ["name","email","direction","motivation"]) $("#"+id).value = draft[id]; $("#agree").checked = draft.agree; }
function collect() { for (const id of ["name","email","direction","motivation"]) draft[id] = $("#"+id).value.trim(); draft.agree = $("#agree").checked; }
function error(id, text) { $("#"+id+"-error").textContent = text; $("#"+id).setAttribute("aria-invalid", String(Boolean(text))); return !text; }
function validate(step) {
  if (step === 0) return [error("name", draft.name ? "" : "Введите имя"), error("email", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email) ? "" : "Введите корректный e-mail")].every(Boolean);
  if (step === 1) return [error("direction", ["web","python"].includes(draft.direction) ? "" : "Выберите направление"), error("motivation", draft.motivation.length >= 20 ? "" : "Введите не менее 20 символов")].every(Boolean);
  return error("agree", draft.agree ? "" : "Подтвердите данные");
}
function renderStep() {
  for (let i = 0; i < 3; i++) $("#step-"+i).hidden = i !== draft.step;
  $("#step").textContent = `Шаг ${draft.step + 1} из 3`;
  $("#back").hidden = draft.step === 0; $("#next").textContent = draft.step === 2 ? "Сохранить заявку" : "Далее";
  $("#review").textContent = `${draft.name}\n${draft.email}\n${draft.direction === "web" ? "Веб-разработка" : "Python"}\n${draft.motivation}`;
}
function renderList() {
  $("#list").replaceChildren();
  for (const application of applications) {
    const row = element("article", "", "card");
    row.append(element("h3", application.name), element("p", `${application.email} · ${application.direction} · ${application.created}`), element("p", application.motivation), button("Удалить заявку", () => {
      const next = applications.filter((item) => item.id !== application.id);
      if (writeStored(local, SAVED, next)) { applications = next; renderList(); message("Заявка удалена", true); }
    }, "danger")); $("#list").append(row);
  }
  if (!applications.length) $("#list").append(element("p", "Сохранённых заявок пока нет", "empty"));
}
$("form").addEventListener("input", () => { collect(); if (writeStored(session, DRAFT, draft)) message("Черновик сохранён в этой вкладке", true); });
$("#back").addEventListener("click", () => { collect(); draft.step--; writeStored(session, DRAFT, draft); renderStep(); });
$("form").addEventListener("submit", (event) => {
  event.preventDefault(); collect();
  if (!validate(draft.step)) { message("Исправьте поля текущего шага"); return; }
  if (draft.step < 2) { draft.step++; writeStored(session, DRAFT, draft); renderStep(); message(""); return; }
  // Повторно проверяем все шаги перед окончательной записью.
  for (let step = 0; step < 3; step++) if (!validate(step)) { draft.step = step; renderStep(); message("Исправьте данные заявки"); return; }
  const next = [...applications.filter((item) => item.id !== draft.id), {...draft, created:new Date().toISOString()}];
  if (!writeStored(local, SAVED, next)) return;
  applications = next;
  try { session.removeItem(DRAFT); } catch { message("Заявка сохранена, но черновик не удалось удалить."); renderList(); return; }
  draft = blank(); fill(); renderStep(); renderList(); message("Заявка сохранена", true);
});
$("#export").addEventListener("click", () => exportJSON(applications, "applications.json"));
fill(); renderStep(); renderList();
