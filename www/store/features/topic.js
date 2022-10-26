import { createSlice } from "@reduxjs/toolkit";
import topicApi from "../../api/topic";
import { generateSlice } from "../../classes/slice-generator";
import { generateActions } from "../../classes/slice-generator";

const topicSchema = {
  name: "topic",
  references: {
    actionItems: "actionItem._id",
    takeaways: "takeaway._id",
  },
  dependencies: {
    meeting: "meeting_id",
  },
};

export const { reducer } = createSlice(generateSlice(topicSchema));
export const actions = generateActions(topicSchema);
export const selectors = {};

/**
 * Like a topic
 * @param {Topic} topic
 */
actions.like = (topic) => {
  return async function like(dispatch) {
    const updatedTopic = await topicApi.like(topic._id);

    dispatch({
      type: "topic/update",
      payload: updatedTopic,
    });
  };
};

export default {
  actions,
  reducer,
  selectors,
};
