import { addEventListenerSignUp } from "./signUp.mjs";
import { addEventListenerLogin, addEventListenerDelete } from "./login.mjs";
import { createCard, getCards } from "./cardOperations.mjs";

const startPageTemplate = document.getElementById("startPageTemplate");
const signUpTemplate = document.getElementById("signUpTemplate");
const loginTemplate = document.getElementById("loginTemplate");
const findCardMenuTemplate = document.getElementById("findCardMenuTemplate");
const createCardTemplate = document.getElementById("createCardTemplate");
const getCardTemplate = document.getElementById("getCardTemplate");

function showPageByTemplate(templateName) {
  let clone;
  const container = document.getElementById("container");
  container.innerHTML = "";

  if (templateName == "startPage") {
    clone = startPageTemplate.content.cloneNode(true);
    container.appendChild(clone);
    document.getElementById("loginButton").addEventListener("click", () => showPageByTemplate("login"));
    document.getElementById("signUpButton").addEventListener("click", () => showPageByTemplate("signUp"));
    document.getElementById("findCardsButton").addEventListener("click", () => showPageByTemplate("findCards"));
  }
  else if (templateName == "signUp") {
    clone = signUpTemplate.content.cloneNode(true);
    container.appendChild(clone);
    addEventListenerSignUp();
  }

  else if (templateName == "login") {
    clone = loginTemplate.content.cloneNode(true);
    container.appendChild(clone);
    addEventListenerLogin(container);
    addEventListenerDelete(container);
  }

  else if (templateName == "findCards") {
    clone = findCardMenuTemplate.content.cloneNode(true);
    container.appendChild(clone);
    document.getElementById("createCardsButton").addEventListener("click", () => showPageByTemplate("createCard"));
    document.getElementById("getCardsButton").addEventListener("click", () => showPageByTemplate("getCards"));
    //document.getElementById("delteCardsButton").addEventListener("click", () => showPageByTemplate("deleteCards"));
  }

  else if (templateName == "createCard") {
    clone = createCardTemplate.content.cloneNode(true);
    container.appendChild(clone);
    const form = container.querySelector("#createCardForm");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      createCard(form);
    });
   
  }

  else if (templateName == "getCards") {
    clone = getCardTemplate.content.cloneNode(true);
    container.appendChild(clone);

    getCards();

    const cardContainer = container.querySelector("#card-sets-container");
    const cards = JSON.parse(localStorage.getItem("cards"));

    for (let i = 0; i < cards.length; i++){
      const h2 = document.createElement("h2");
      h2.innerText = cards[i].cardName;
      cardContainer.appendChild(h2);
    }
  }

}

showPageByTemplate("startPage");

