import { combineReducers } from "redux";

import userReducer from "./features/user";
import themeReducer from "./features/theme";
import drawerReducer from "./features/drawer";
import snackbarReducer from "./features/snackbar";
import topic from "./features/topic";
import meeting from "./features/meeting";
import actionItem from "./features/action-item";
import takeaway from "./features/takeaway";
import participant from "./features/participant";
import avatarReducer from "./features/avatar";

const rootReducer = combineReducers({
  user: userReducer,
  theme: themeReducer,
  drawer: drawerReducer,
  snackbar: snackbarReducer,
  topic: topic.reducer,
  meeting: meeting.reducer,
  participant: participant.reducer,
  takeaway: takeaway.reducer,
  actionItem: actionItem.reducer,
  avatar: avatarReducer
});

export default rootReducer;
