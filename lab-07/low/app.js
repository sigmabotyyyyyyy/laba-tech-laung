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

const pages = [
  {title:"О себе", text:"Я изучаю языки и технологии программирования. Это демонстрационная визитка студента.", items:["Направление: программная инженерия", "Интересы: веб-разработка и автоматизация"]},
  {title:"Навыки", text:"Что я практикую на лабораторных занятиях", items:["Python: расчёты и классы", "HTML и CSS: структура и оформление", "JavaScript: DOM, события и JSON"]},
  {title:"Контакты", text:"Пример контактных данных для учебного проекта", items:["E-mail: student@example.com", "Группа: учебная группа"]}
];
function render() {
  const page = pages[activeTab], list = document.createElement("ul");
  for (const item of page.items) list.append(element("li", item));
  $("#content").replaceChildren(element("h2", page.title), element("p", page.text), list);
}
activate(0);
