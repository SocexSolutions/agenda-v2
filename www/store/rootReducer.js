import { combineReducers } from "redux";

import userReducer    from "./features/user/userSlice";
import meetingReducer from "./features/meetings/meetingSlice";

const rootReducer = combineReducers({
  user: userReducer,
  meetings: meetingReducer
});

export default rootReducer;
