const countdownTimerTemplate = document.createElement("template");
const boundTemplate = config => {
  countdownTimerTemplate.innerHTML = `
    <style>
      :host {
        display: flex;
        width: 80px;
        height: 80px;
        align-items: center;
        justify-content: center;
        position: relative;
      }

      svg {
        position: absolute;
        top: 0;
        right: 0;
        width: 80px;
        height: 80px;
        transform: rotateY(-180deg) rotateZ(-90deg);
      }

      svg circle {
        stroke-dasharray: 240px;
        stroke-dashoffset: 0px;
        stroke-width: 2px;
        stroke: white;
        fill: none;
      }

      svg.animate circle {
        animation: countdown ${config.seconds}s linear infinite forwards;
      }

      .hide {
        display: none;
      }

      @keyframes countdown {
        from {
          stroke-dashoffset: 0px;
        }
        to {
          stroke-dashoffset: 240px;
        }
      }
    </style>
    <div id="countdown"></div>
    <svg>
      <circle r="38" cx="40" cy="40"></circle>
    </svg>
  `;

  return countdownTimerTemplate;
};

class CountdownTimer extends HTMLElement {
  get seconds() {
    return this.getAttribute("seconds");
  }

  set countdown(time) {
    this.shadowRoot.querySelector("#countdown").textContent = time;
  }

  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.loop = 0;
    this._intervalHandler = this._intervalHandler.bind(this);
  }

  connectedCallback() {
    const config = {
      seconds: this.seconds
    };

    const template = boundTemplate(config);
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.countdown = this.seconds;
  }

  start() {
    this.reset();

    this.shadowRoot.querySelector("svg").classList.add("animate");
    this.interval = setInterval(this._intervalHandler, 1000);
  }

  reset() {
    this.loop = 0;
    this.countdown = this.seconds;
    this.shadowRoot.querySelector("svg").classList.remove("hide");
  }

  _intervalHandler() {
    this.loop++;

    this.countdown = this.seconds - this.loop;

    if (this.loop === parseInt(this.seconds, 10)) {
      clearInterval(this.interval);
      this.shadowRoot.querySelector("svg").classList.remove("animate");
      this.shadowRoot.querySelector("svg").classList.add("hide");
    }
  }
}

window.customElements.define("countdown-timer", CountdownTimer);
