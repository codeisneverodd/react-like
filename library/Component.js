import { render, eventHolder } from './render/index.js';
import { mediaQueryProcessor, pseudoClassProcessor, styleCombinator, uuidAdder } from './stylePreprocessor.js';

class Component {
  constructor(props) {
    this.state = {};
    this.props = props;
    this.uuid = this.constructor.name + '-' + self.crypto.randomUUID().slice(0, 8);
    this.holdEvents();
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    render(this, document.querySelector(`[data-uuid='${this.uuid}']`));
  }

  preprocessor(domStr) {
    let result = domStr;
    result = uuidAdder(result, this.uuid);
    result = styleCombinator(result);
    result = pseudoClassProcessor(result);
    result = mediaQueryProcessor(result);
    return result;
  }

  holdEvents() {
    const events = this.addEventListener?.();
    if (!events) return;

    for (const event of events) {
      if (event.selector === 'window' || !event.selector) {
        eventHolder.push({ ...event, uuid: this.uuid });
        continue;
      }
      const { selector, handler } = event;

      event.handler = e => {
        if (e.target.closest(`[data-uuid='${this.uuid}']`) && e.target.closest(selector)) {
          handler(e);
        }
      };

      eventHolder.push({ ...event, uuid: this.uuid });
    }
  }

  render() {
    return this.preprocessor(this.domStr());
  }
}

export default Component;
