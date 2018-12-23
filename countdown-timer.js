const countdownTimerTemplate = document.createElement("template");
const boundTemplate = config => {
  countdownTimerTemplate.innerHTML = `
    <style>
      :host {
        display: block;
        width: 80px;
        height: 80px;
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
    let loop = 0;

    this.shadowRoot.querySelector("svg").classList.add("animate");

    this.interval = setInterval(() => {
      loop++;

      this.countdown = this.seconds - loop;

      if (loop === parseInt(this.seconds, 10)) {
        loop = 0;
      }
    }, 1000);
  }

  reset() {}

  pause() {}
}

window.customElements.define("countdown-timer", CountdownTimer);
