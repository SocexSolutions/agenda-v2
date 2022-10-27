import { createSlice } from "@reduxjs/toolkit";
import { generateSlice } from "../utils/slice-generator";
import topicApi from "../../api/topic";

const topicSchema = {
  name: "topic",
  references: {
    actionItems: "actionItem",
    takeaways: "takeaway",
  },
  dependencies: {
    meeting: "meeting_id",
  },
};

const { reducers, actions, selectors } = generateSlice(topicSchema);

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

/**
 * Switch to a different topic
 * @param {Topic} topic
 */
actions.switch = (topic) => {
  return async function switchTopic(dispatch) {
    const { switchedTo, switchedFrom } = await topicApi.switch(topic._id);

    dispatch({
      type: "topic/update",
      payload: switchedTo,
    });

    dispatch({
      type: "topic/update",
      payload: switchedFrom,
    });
  };
};

/**
 * Close a topic
 * @param {Topic} topic
 */
actions.close = (topic) => {
  return async function closeTopic(dispatch) {
    const updatedTopic = await topicApi.close(topic._id);

    dispatch({
      type: "topic/update",
      payload: updatedTopic,
    });
  };
};

export const { reducer } = createSlice({
  name: topicSchema.name,
  initialState: {},
  reducers,
});

export default {
  actions,
  reducer,
  selectors,
};
