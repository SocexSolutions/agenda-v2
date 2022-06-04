import { applyMiddleware, createStore } from 'redux';
import { useMemo }                      from 'react';
import thunkMiddleware                  from 'redux-thunk';
import { composeWithDevTools }          from 'redux-devtools-extension';
import rootReducer                      from './rootReducer';

let _store;

const composedEnhancer = composeWithDevTools(
  applyMiddleware( thunkMiddleware )
);

function initStore( initialState ) {
  return createStore( rootReducer, initialState, composedEnhancer );
}

export const initializeStore = ( preloadedState ) => {
  let new_store = _store ?? initStore( preloadedState );

  if ( preloadedState && _store ) {
    new_store = initStore({
      ..._store.getState(),
      ...preloadedState
    });

    _store = undefined;
  }

  if ( typeof window === 'undefined' ) {
    return new_store;
  }

  if ( !_store ) {
    _store = new_store;
  }

  return new_store;
};

export function useStore( initialState ) {
  _store = useMemo( () =>
    initializeStore( initialState ), [ initialState ]
  );

  return _store;
}


export function store() {
  return _store;
}
