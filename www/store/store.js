import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import rootReducer from './rootReducer';

const composedEnhancer = composeWithDevTools( 
  applyMiddleware( thunkMiddleware ) 
);

const store = createStore( rootReducer,  composedEnhancer );

export default store;
