import { combineReducers } from "redux";

import userReducer from "./features/user";
import themeReducer from "./features/theme";
import drawerReducer from "./features/drawer";
import snackbarReducer from "./features/snackbar";
import topicReducer from "./features/topic";
import meetingReducer from "./features/meeting";

const rootReducer = combineReducers({
  user: userReducer,
  theme: themeReducer,
  drawer: drawerReducer,
  snackbar: snackbarReducer,
  topic: topicReducer,
  meeting: meetingReducer,
});

export default rootReducer;
