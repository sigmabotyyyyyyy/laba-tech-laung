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

let activeTab = 0;
function activate(index) {
  activeTab = index;
  document.querySelectorAll("[data-tab]").forEach((tab, i) => {
    tab.setAttribute("aria-selected", String(i === index)); tab.tabIndex = i === index ? 0 : -1;
  });
  $("#content").setAttribute("aria-labelledby", `tab-${index}`);
  render();
}
document.querySelectorAll("[data-tab]").forEach((tab, i) => {
  tab.addEventListener("click", () => activate(i));
  tab.addEventListener("keydown", (event) => {
    const count = document.querySelectorAll("[data-tab]").length;
    let index = i;
    if (event.key === "ArrowRight") index = (i + 1) % count;
    else if (event.key === "ArrowLeft") index = (i - 1 + count) % count;
    else if (event.key === "Home") index = 0;
    else if (event.key === "End") index = count - 1;
    else return;
    event.preventDefault(); activate(index); $("#tab-" + index).focus();
  });
});

let articles = [], loading = true, loadError = "", category = "";
const favorites = new Set();
function render() {
  $("#content").replaceChildren();
  if (loading) { $("#content").append(element("p", "Загрузка статей…")); return; }
  if (loadError) { $("#content").append(element("p", loadError, "error"), button("Повторить загрузку", load)); return; }
  if (activeTab === 1) {
    $("#content").append(element("h2", "Категории"));
    for (const name of new Set(articles.map((article) => article.category))) $("#content").append(button(name, () => { category = name; activate(0); }));
    if (!articles.length) $("#content").append(element("p", "Категорий пока нет", "empty"));
    return;
  }
  $("#content").append(element("h2", activeTab === 2 ? "Избранное" : category || "Все статьи"));
  if (category && activeTab === 0) $("#content").append(button("Все категории", () => { category = ""; render(); }));
  const query = $("#search").value.trim().toLocaleLowerCase();
  const visible = articles.filter((a) => (activeTab !== 2 || favorites.has(a.id)) && (activeTab !== 0 || !category || a.category === category) && `${a.title} ${a.text}`.toLocaleLowerCase().includes(query));
  for (const article of visible) {
    const card = element("article", "", "card");
    card.append(element("span", article.category, "badge"), element("h3", article.title), element("p", article.text), button(favorites.has(article.id) ? "Убрать из избранного" : "В избранное", () => {
      if (favorites.has(article.id)) favorites.delete(article.id); else favorites.add(article.id); render();
    })); $("#content").append(card);
  }
  if (!visible.length) $("#content").append(element("p", "Статьи не найдены", "empty"));
}
async function load() {
  loading = true; loadError = ""; render();
  try {
    const response = await fetch("articles.json");
    if (!response.ok) throw new Error("HTTP " + response.status);
    const data = await response.json();
    if (!Array.isArray(data) || !data.every((a) => a && typeof a.id === "number" && [a.title,a.category,a.text].every((s) => typeof s === "string")) || new Set(data.map((a) => a.id)).size !== data.length) throw new Error("Неверный формат данных");
    articles = data;
  } catch (error) { loadError = "Не удалось загрузить статьи. Проверьте локальный сервер и articles.json. " + error.message; }
  finally { loading = false; render(); }
}
$("#search").addEventListener("input", render); activate(0); load();
