import { Component, styled } from "./library/index.js";

class Something extends Component {
  constructor(props) {
    super(props);
    this.state = {}; // declare state of component
  }

  // declare shape of component
  domStr() {
    return `
      <div ${styles.container}>
        ${new AnotherComponent.render()}
        <button class="refresh">refresh</button>
      </div>
    `;
  }

  // declare events of component
  addEventListener() {
    return [
      {
        type: "click",
        selector: ".refresh",
        handler: async () => refresh.call(this),
      },
    ];
  }

  refresh(e) {
    //...
  }
}

const styles = {
  container: styled({
    display: "flex",
    "justify-content": "space-between",
    "text-align": "left",
    width: "100%",
    "font-size": "28px",
    "@desktop": {
      "overflow-x": "hidden",
      "flex-wrap": "wrap",
      "column-gap": "80px",
    },
    ":onMouseOver": {
      "background-color": "blue",
    },
  }),
};
