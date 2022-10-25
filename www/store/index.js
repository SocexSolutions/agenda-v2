import { configureStore } from "@reduxjs/toolkit";
import { useMemo } from "react";
import thunk from "redux-thunk";
import root from "./root";

let _store;

function initStore() {
  return configureStore({
    reducer: root,
    middleware: [thunk],
  });
}

export const initializeStore = (preloadedState) => {
  let new_store = _store ?? initStore(preloadedState);

  if (preloadedState && _store) {
    new_store = initStore({
      ..._store.getState(),
      ...preloadedState,
    });

    _store = undefined;
  }

  if (typeof window === "undefined") {
    return new_store;
  }

  if (!_store) {
    _store = new_store;
  }

  return new_store;
};

export function useStore(initialState) {
  _store = useMemo(() => initializeStore(initialState), [initialState]);

  return _store;
}

export function store() {
  return _store;
}
