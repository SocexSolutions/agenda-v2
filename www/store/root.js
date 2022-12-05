import { combineReducers } from "redux";

import { createNormalizedReducer } from "./utils/slice-generator";

import userReducer from "./features/user";
import themeReducer from "./features/theme";
import drawerReducer from "./features/drawer";
import snackbarReducer from "./features/snackbar";
import topic from "./features/topic";
import meeting from "./features/meeting";
import takeaway from "./features/takeaway";
import actionItem from "./features/action-item";
import participant from "./features/participant";

const normalizedReducer = createNormalizedReducer({
  topic: topic.schema,
  meeting: meeting.schema,
  takeaway: takeaway.schema,
  actionItem: actionItem.schema,
  participant: participant.schema,
});

const rootReducer = combineReducers({
  user: userReducer,
  theme: themeReducer,
  drawer: drawerReducer,
  snackbar: snackbarReducer,
  normalized: normalizedReducer,
});

export default rootReducer;
