import eventHolder from './eventHolder.js';
import applyDiff from './applyDiff.js';

const bindEventHandler = () => {
  for (const { type, handler } of eventHolder) window.addEventListener(type, handler);
};

const unbindEventHandler = () => {
  const removeHolders = [];

  for (const holder of eventHolder) {
    const { type, handler, uuid } = holder;
    if (document.querySelector(`[data-uuid='${uuid}']`)) return;

    window.removeEventListener(type, handler);
    removeHolders.push(holder);
  }

  eventHolder.length = 0;
  eventHolder.push(...eventHolder.filter(holder => !removeHolders.includes(holder)));
};

let init = true;
let initInstance = null;
let $initContainer = null;

const domStrToNode = domStr => {
  const $temp = document.createElement('div');
  $temp.innerHTML = domStr;
  if ($temp.childElementCount > 1)
    throw new Error(`컴포넌트는 하나의 태그로 감싸야합니다!!, ${domStr.slice(0, 100)}...`);
  return $temp.firstElementChild;
};

const render = (RootInstance, $container) => {
  let $virtual;
  let $real;

  if (init || !RootInstance) {
    if (init) {
      initInstance = RootInstance;
      $initContainer = $container;
      init = false;
    } else {
      unbindEventHandler();
    }

    $real = $initContainer;
    $virtual = $initContainer.cloneNode();
    $virtual.innerHTML = initInstance.render();
  } else {
    unbindEventHandler();
    $real = $container;
    $virtual = domStrToNode(RootInstance.render());
  }

  applyDiff($real, $virtual);
  bindEventHandler();
};

export default render;
