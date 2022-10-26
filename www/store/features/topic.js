import { createSlice } from "@reduxjs/toolkit";
import topicApi from "../../api/topic";
import { generateSlice } from "../utils/slice-generator";
import { generateActions } from "../utils/slice-generator";
import { generateSelectors } from "../utils/slice-generator";

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

export const { reducer } = createSlice(generateSlice(topicSchema));
export const actions = generateActions(topicSchema);
export const selectors = generateSelectors(topicSchema);

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
    const updatedTopic = await topicApi.switch(topic._id);

    dispatch({
      type: "topic/update",
      payload: updatedTopic,
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

export default {
  actions,
  reducer,
  selectors,
};
