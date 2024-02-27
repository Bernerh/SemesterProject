import { initializeSignUpForm } from "./signUp.mjs";
import { addEventListenerLogin } from "./login.mjs";

const startPageTemplate = document.getElementById("startPageTemplate");
const signUpTemplate = document.getElementById("signUpTemplate");
const loginTemplate = document.getElementById("loginTemplate");
const findCardsMenuTemplate = document.getElementById("findCardsMenuTemplate");
//const createCardsTemplate = document.getElementById("createCardsTemplate");

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
    // document.getElementById("createCardsButton").addEventListener("click", () => showPageByTemplate("createCard"));
  }
  else if (templateName == "signUp") {
    clone = signUpTemplate.content.cloneNode(true);

    container.appendChild(clone);
    initializeSignUpForm();

  }
  else if (templateName == "login") {
    clone = loginTemplate.content.cloneNode(true);

    container.appendChild(clone);

    addEventListenerLogin(container);
  }

  else if (templateName == "findCards") {
    clone = findCardsMenuTemplate.content.cloneNode(true);
    container.appendChild(clone);
  }
  /*
    else if (templateName == "createCard") { 
      clone = createCardsTemplate.content.cloneNode(true);
      container.appendChild(clone);
    
    }
    */
}

showPageByTemplate("startPage");

