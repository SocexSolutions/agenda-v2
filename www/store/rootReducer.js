import { combineReducers } from 'redux';

import userReducer     from './features/user/userSlice';
import meetingReducer  from './features/meetings/meetingSlice';
import themeReducer    from './features/theme/themeSlice';
import drawerReducer   from './features/drawer/drawerSlice';
import snackbarReducer from './features/snackbar/snackbarSlice';

const rootReducer = combineReducers({
  user:     userReducer,
  meetings: meetingReducer,
  theme:    themeReducer,
  drawer:   drawerReducer,
  snackbar: snackbarReducer
});

export default rootReducer;
