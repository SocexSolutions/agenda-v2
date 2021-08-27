import { combineReducers } from 'redux';

import userReducer from './features/user/userSlice';


const rootReducer = combineReducers({
  user: userReducer
})

export default rootReducer;