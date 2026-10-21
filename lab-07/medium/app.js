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

const books = [{id:1,title:"Абай жолы",author:"Мухтар Ауэзов"},{id:2,title:"Маленький принц",author:"Антуан де Сент-Экзюпери"},{id:3,title:"Приключения Тома Сойера",author:"Марк Твен"}];
const favorites = new Set();
function render() {
  $("#content").replaceChildren();
  if (activeTab === 2) { $("#content").append(element("h2", "О библиотеке"), element("p", "Учебный каталог. Избранное хранится в памяти до обновления страницы.")); return; }
  $("#content").append(element("h2", activeTab === 0 ? "Каталог" : "Избранное"));
  const selected = books.filter((book) => activeTab === 0 || favorites.has(book.id));
  if (!selected.length) $("#content").append(element("p", "В избранном пока нет книг", "empty"));
  for (const book of selected) {
    const card = element("article", "", "card");
    card.append(element("h3", book.title), element("p", book.author), button(favorites.has(book.id) ? "Убрать из избранного" : "В избранное", () => {
      if (favorites.has(book.id)) favorites.delete(book.id); else favorites.add(book.id);
      $("#tab-1").textContent = `Избранное (${favorites.size})`; render();
    })); $("#content").append(card);
  }
}
activate(0);
