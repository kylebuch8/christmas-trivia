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

      #answer {
        visibility: visible;
        font-size: 2rem;
        padding: 20px 40px;
        background-color: rgba(0,0,0,.5);
      }

      #answer.show {
        visibility: visible;
      }
    </style>
    <h1>${data.question}</h1>
    <p id="answer">${data.answer}</p>
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

  showAnswer() {
    this.shadowRoot.querySelector("#answer").classList.add("show");
  }

  reset() {
    this.shadowRoot.querySelector("#answer").classList.remove("show");
  }
}

window.customElements.define("trivia-question", TriviaQuestion);
