const christmasTriviaTemplate = document.createElement("template");
const boundChristmasTriviaTemplate = triviaQuestions => {
  christmasTriviaTemplate.innerHTML = `
    <style>
      :host {
        display: block;
      }
    </style>
    ${triviaQuestions
      .map(
        triviaQuestion => `
      <trivia-question question="${triviaQuestion.question}" answer="${
          triviaQuestion.answer
        }"></trivia-question>
    `
      )
      .join("")}
  `;

  return christmasTriviaTemplate;
};

class ChristmasTrivia extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this._dataHandler = this._dataHandler.bind(this);

    fetch("questions.json")
      .then(res => res.json())
      .then(this._dataHandler);
  }

  _dataHandler(data) {
    const template = boundChristmasTriviaTemplate(data);
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

window.customElements.define("christmas-trivia", ChristmasTrivia);

const triviaQuestionTemplate = document.createElement("template");
const boundTriviaQuestion = data => {
  triviaQuestionTemplate.innerHTML = `
    <style>
      :host {
        display: block;
      }
    </style>
    <h1>Question: ${data.question}</h1>
    <p>Answer: ${data.answer}</p>
  `;

  return triviaQuestionTemplate;
};

class TriviaQuestion extends HTMLElement {
  get question() {
    return this.getAttribute("question");
  }

  get answer() {
    return this.getAttribute("answer");
  }

  constructor() {
    super();

    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const template = boundTriviaQuestion({
      question: this.question,
      answer: this.answer
    });

    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

window.customElements.define("trivia-question", TriviaQuestion);
