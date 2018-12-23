import "./countdown-timer.js";

function generateId() {
  return Math.random()
    .toString(36)
    .substr(2, 9);
}

const triviaQuestionTemplate = document.createElement("template");
const boundTriviaQuestion = data => {
  triviaQuestionTemplate.innerHTML = `
    <style>
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding-left: 25%;
        padding-right: 25%;
      }

      h1 {
        margin-top: 0;
        font-size: 2rem;
        font-weight: 400;
      }

      #container {
        height: 100px;
      }

      #answer {
        /* visibility: visible; */
        display: none;
        font-size: 2rem;
        padding: 20px 40px;
        background-color: rgba(0,0,0,.5);
      }

      #answer.show {
        /* visibility: visible; */
        display: block;
      }

      .hide {
        display: none;
      }
    </style>
    <h1>${data.question}</h1>
    <div id="container">
      <countdown-timer seconds="5"></countdown-timer>
      <div id="answer">${data.answer}</div>
    </div>
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

  static get observedAttributes() {
    return ["active"];
  }

  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.id = `question-${generateId()}`;
  }

  connectedCallback() {
    const template = boundTriviaQuestion({
      question: this.question,
      answer: this.answer,
      id: this.id
    });

    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  attributeChangedCallback(attr, oldVal, newVal) {
    if (attr === "active") {
      if (newVal !== null) {
        this.shadowRoot.querySelector("countdown-timer").reset();
        this.shadowRoot.querySelector("countdown-timer").start();
      }
    }
  }

  showAnswer() {
    this.shadowRoot.querySelector("#answer").classList.add("show");
    this.shadowRoot.querySelector("countdown-timer").classList.add("hide");
  }

  reset() {
    this.shadowRoot.querySelector("#answer").classList.remove("show");
    this.shadowRoot.querySelector("countdown-timer").classList.remove("hide");
  }
}

window.customElements.define("trivia-question", TriviaQuestion);
