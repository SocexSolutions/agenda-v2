import { combineReducers } from 'redux';

import userReducer from './features/user/userSlice';
import meetingReducer from './features/meetings/meetingSlice';
import uiReducer from './features/ui/uiSlice';

const rootReducer = combineReducers({
  user: userReducer,
  meetings: meetingReducer,
  ui: uiReducer
});

export default rootReducer;
