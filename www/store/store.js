import { applyMiddleware, createStore } from "redux";
import { useMemo }                      from "react";
import thunkMiddleware                  from "redux-thunk";
import { composeWithDevTools }          from "redux-devtools-extension";
import rootReducer                      from "./rootReducer";

let store;

const composedEnhancer = composeWithDevTools(
  applyMiddleware( thunkMiddleware )
);

function initStore( initialState ) {
  return createStore( rootReducer, initialState, composedEnhancer );
}

export const initializeStore = ( preloadedState ) => {

  let _store = store ?? initStore( preloadedState );

  if ( preloadedState && store ) {
    _store = initStore({
      ...store.getState(),
      ...preloadedState,
    });

    store = undefined;
  }

  if ( typeof window === "undefined" ) {
    return _store;
  }

  if ( !store ) {
    store = _store;
  }

  return _store;
};

export function useStore( initialState ) {
  const store = useMemo( () =>
    initializeStore( initialState ), [ initialState ]
  );

  return store;
}
