import meetingAPI from "../../api/meeting";
import { generateActions } from "../utils/slice-generator";
import { generateSelectors } from "../utils/slice-generator";

export const schema = {
  name: "meeting",
  references: ["topic", "participant", "actionItem", "takeaway"],
};

export const actions = generateActions(schema);

export const selectors = generateSelectors(schema);

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

export default {
  schema,
  actions,
  selectors,
};
