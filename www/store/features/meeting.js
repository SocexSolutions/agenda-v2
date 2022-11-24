import { createSlice } from "@reduxjs/toolkit";
import { generateSlice } from "../utils/slice-generator";
import { generateActions } from "../utils/slice-generator";
import { generateSelectors } from "../utils/slice-generator";
import meetingAPI from "../../api/meeting";

const meetingSchema = {
  name: "meeting",
  references: {
    topics: "topic",
    participants: "participant",
    actionItems: "actionItem",
    takeaways: "takeaway",
  },
};

export const { reducer } = createSlice(generateSlice(meetingSchema));
export const actions = generateActions(meetingSchema);

actions.updateStatus = (meeting_id, status) => {
  return async (dispatch) => {
    const updated = await meetingAPI.updateStatus(meeting_id, status);

    if (!updated) {
      return;
    }

    dispatch({
      type: "meeting/update",
      payload: { _id: meeting_id, status },
    });
  };
};

export const selectors = generateSelectors(meetingSchema);

export default {
  reducer,
  actions,
  selectors,
};
