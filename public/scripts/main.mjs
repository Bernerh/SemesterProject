import { addEventListenerSignUp } from "./signUp.mjs";
import { addEventListenerLogin, addEventListenerDelete, addEventListenerEdit } from "./login.mjs";
import { createCard, getCards, getCardInfo, deleteCards } from "./cardOperations.mjs";

const startPageTemplate = document.getElementById("startPageTemplate");
const signUpTemplate = document.getElementById("signUpTemplate");
const loginTemplate = document.getElementById("loginTemplate");
const findCardMenuTemplate = document.getElementById("findCardMenuTemplate");
const createCardTemplate = document.getElementById("createCardTemplate");
const getCardTemplate = document.getElementById("getCardTemplate");
const flashCardTemplate = document.getElementById("flashCardTemplate");
const editUserTemplate = document.getElementById("editUserTemplate");
const deleteCardTemplate = document.getElementById("deleteCardTemplate");

async function showPageByTemplate(templateName) {
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
    document.getElementById("editUserButton").addEventListener("click", () => showPageByTemplate("editUserTemplate"));
    addEventListenerDelete(container);
  }

  else if (templateName == "editUserTemplate") {
    clone = editUserTemplate.content.cloneNode(true);
    container.appendChild(clone);
    addEventListenerEdit(container);
  }

  else if (templateName == "findCards") {
    clone = findCardMenuTemplate.content.cloneNode(true);
    container.appendChild(clone);
    document.getElementById("createCardsButton").addEventListener("click", () => showPageByTemplate("createCard"));
    document.getElementById("getCardsButton").addEventListener("click", () => showPageByTemplate("getCards"));
    document.getElementById("deleteCardsButton").addEventListener("click", () => showPageByTemplate("deleteCards"));
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

  else if (templateName == "deleteCards") {
    clone = deleteCardTemplate.content.cloneNode(true);
    container.appendChild(clone);
    const form = container.querySelector("#deleteCardForm");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const id = container.querySelector("#cardId").value;

      deleteCards(id);
    });
  }

  else if (templateName == "getCards") {
    clone = getCardTemplate.content.cloneNode(true);
    container.appendChild(clone);

    getCards();

    const cardContainer = container.querySelector("#card-sets-container");
    const cards = JSON.parse(localStorage.getItem("cards"));


    for (let i = 0; i < cards.length; i++) {

      const cardNameElement = document.createElement("div");
      cardNameElement.className = 'card-name';
      cardNameElement.innerText = cards[i].cardName;

      cardNameElement.addEventListener("click", () => {
        showPageByTemplate("flashCardTemplate");
        sessionStorage.setItem("cardID", cards[i].cardID)
      });
      cardContainer.appendChild(cardNameElement);
    }
  }

  else if (templateName == "flashCardTemplate") {
    const cardID = sessionStorage.getItem("cardID");
    const cardInfo = await getCardInfo(cardID);

    const wordSentences = JSON.parse(cardInfo[0].wordSentence);
    const meanings = JSON.parse(cardInfo[0].meaning);

    let currentWordIndex = 0;
    let showingWord = true;

    clone = flashCardTemplate.content.cloneNode(true);
    const flashcardContent = clone.querySelector(".flashcard-content");
    const wordSpan = flashcardContent.querySelector("#wordSentence");
    const meaningSpan = flashcardContent.querySelector("#meaning");

    const showContent = () => {
      wordSpan.classList.toggle('shown', showingWord);
      meaningSpan.classList.toggle('shown', !showingWord);

      wordSpan.textContent = wordSentences[currentWordIndex];
      meaningSpan.textContent = meanings[currentWordIndex];

      console.log(`Current index: ${currentWordIndex}`);
      console.log(`Showing word: ${showingWord}`);
    };

    showContent();

    flashcardContent.addEventListener('click', () => {
      if (showingWord) {
        showingWord = false;
      } else {
        currentWordIndex = (currentWordIndex + 1) % Object.keys(wordSentences).length;
        showingWord = true;
      }
      showContent();
    });

    container.appendChild(clone);
  }
}

showPageByTemplate("startPage");