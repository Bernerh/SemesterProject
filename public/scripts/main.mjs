
import { initializeSignUpForm } from "./signUp.mjs";  //NEW

const startPageTemplate = document.getElementById("startPageTemplate");
const signUpTemplate = document.getElementById("signUpTemplate");
const loginTemplate = document.getElementById("loginTemplate");

function showPageByTemplate(templateName) {
  let clone;
  const container = document.getElementById("container");
  container.innerHTML = "";

  if (templateName == "startPage") {
    clone = startPageTemplate.content.cloneNode(true);
    container.appendChild(clone);

    document.getElementById("loginButton").addEventListener("click", () => showPageByTemplate("login"));
    document.getElementById("signUpButton").addEventListener("click", () => showPageByTemplate("signUp"));
  }
  else if (templateName == "signUp") {
    clone = signUpTemplate.content.cloneNode(true);

    container.appendChild(clone);
    initializeSignUpForm();

  }
  else if (templateName == "login") {
    clone = loginTemplate.content.cloneNode(true);

  }

  container.appendChild(clone);
}

showPageByTemplate("startPage");