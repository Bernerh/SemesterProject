import { addEventListenerSignUp } from "./signUp.mjs";
import { addEventListenerLogin } from "./login.mjs";

const startPageTemplate = document.getElementById("startPageTemplate");
const signUpTemplate = document.getElementById("signUpTemplate");
const loginTemplate = document.getElementById("loginTemplate");
const findCardMenuTemplate = document.getElementById("findCardMenuTemplate");
const createCardTemplate = document.getElementById("createCardTemplate");

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
  }

  else if (templateName == "findCards") {
    clone = findCardMenuTemplate.content.cloneNode(true);
    container.appendChild(clone);
    document.getElementById("createCardsButton").addEventListener("click", () => showPageByTemplate("createCard"));
    //document.getElementById("getCardsButton").addEventListener("click", () => showPageByTemplate("getCards"));
    // document.getElementById("delteCardsButton").addEventListener("click", () => showPageByTemplate("deleteCards"));
  }

  else if (templateName == "createCard") {
    clone = createCardTemplate.content.cloneNode(true);
    container.appendChild(clone);
    //addEventListenerCreateCards(container);  //Add funksjon seinare
  }

}

showPageByTemplate("startPage");

