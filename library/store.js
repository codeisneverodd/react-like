import Component from './Component.js';
import render from './render/render.js';

export const createStore = init => {
  let store = init;

  function setStore(newStore) {
    if (!(this instanceof Component)) {
      throw new Error('store는 component 내에서만 사용되어야 합니다! 혹은 setter 함수를 함수선언식으로 선언하세요!');
    }

    store = { ...store, ...newStore };
    // console.log(store);
    render(this, document.querySelector(`[data-uuid='${this.uuid}']`));
  }

  function getStore() {
    return store;
  }
  return { getStore, setStore };
};

export const useStore = storeObj => [storeObj.getStore(), storeObj.setStore];
