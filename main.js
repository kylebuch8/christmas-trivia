import "./trivia-question.js";
import "./countdown-timer.js";

const colors = ["red", "purple", "green"];

const christmasTriviaTemplate = document.createElement("template");
const boundChristmasTriviaTemplate = triviaQuestions => {
  christmasTriviaTemplate.innerHTML = `
    <style>
      :host {
        display: block;
        height: 100%;
      }

      countdown-timer {
        position: fixed;
        right: 0;
        bottom: 0;
      }

      trivia-question {
        color: white;
      }

      trivia-question.red {
        background-color: #b70129;
      }

      trivia-question.purple {
        background-color: #847790;
      }

      trivia-question.green {
        background-color: #3d6c6e;
      }
    </style>
    ${triviaQuestions
      .map(
        (triviaQuestion, index) => `
      <trivia-question class="${colors[index % 3]}" id="${
          triviaQuestion.id
        }" question="${triviaQuestion.question}" answer="${
          triviaQuestion.answer
        }"></trivia-question>
    `
      )
      .join("")}
    <countdown-timer seconds="4"></countdown-timer>
  `;

  return christmasTriviaTemplate;
};

class ChristmasTrivia extends HTMLElement {
  get questionsUrl() {
    return this.getAttribute("questions-url");
  }

  get activeQuestion() {
    return this.shadowRoot.querySelector("trivia-question[active]");
  }

  set activeQuestion(id) {
    if (this.activeQuestion) {
      this.activeQuestion.reset();
      this.activeQuestion.removeAttribute("active");
    }

    this.shadowRoot.querySelector(`#${id}`).setAttribute("active", "");
  }

  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this._dataHandler = this._dataHandler.bind(this);
    this._startQuestion = this._startQuestion.bind(this);
    this._showAnswer = this._showAnswer.bind(this);
    this.questionDuration = 4000;
    this.answerDuration = this.questionDuration / 2;
  }

  connectedCallback() {
    fetch(this.questionsUrl)
      .then(res => res.json())
      .then(this._dataHandler);
  }

  _dataHandler(data) {
    let questions = data.feed.entry;
    questions = questions.map(_question => {
      return {
        question: _question.gsx$question.$t,
        answer: _question.gsx$answer.$t
      };
    });

    const template = boundChristmasTriviaTemplate(questions);
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this._advance();
  }

  _startQuestion() {
    this.shadowRoot.querySelector("countdown-timer").start();

    setTimeout(() => {
      this._showAnswer();
    }, this.questionDuration);
  }

  _showAnswer() {
    this.activeQuestion.showAnswer();
    setTimeout(() => {
      this._advance();
    }, this.answerDuration);
  }

  _advance() {
    if (!this.activeQuestion) {
      this.activeQuestion = this.shadowRoot.querySelector("trivia-question").id;
    } else {
      this.activeQuestion = this.activeQuestion.nextElementSibling.id;
    }

    this.activeQuestion.scrollIntoView({ behavior: "smooth" });

    this._startQuestion();
  }
}

window.customElements.define("christmas-trivia", ChristmasTrivia);
