import { combineReducers } from "redux";

import userReducer from "./features/user";
import themeReducer from "./features/theme";
import drawerReducer from "./features/drawer";
import snackbarReducer from "./features/snackbar";
import topic from "./features/topic";
import meeting from "./features/meeting";

const rootReducer = combineReducers({
  user: userReducer,
  theme: themeReducer,
  drawer: drawerReducer,
  snackbar: snackbarReducer,
  topic: topic.reducer,
  meeting: meeting.reducer,
});

export default rootReducer;
