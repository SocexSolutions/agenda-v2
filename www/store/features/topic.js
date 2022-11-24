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

    if (!updatedTopic) {
      return;
    }

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
    const res = await topicApi.switch(topic._id);

    if (!res || res?.switchedTo?._id === res?.switchedFrom?._id) {
      return;
    }

    if (res.switchedTo) {
      dispatch({
        type: "topic/update",
        payload: res.switchedTo,
      });
    }

    if (res.switchedFrom) {
      dispatch({
        type: "topic/update",
        payload: res.switchedFrom,
      });
    }
  };
};

/**
 * Close a topic
 * @param {Topic} topic
 */
actions.close = (topic) => {
  return async function closeTopic(dispatch) {
    const updated = await topicApi.close(topic._id);

    if (!updated) {
      return;
    }

    dispatch({
      type: "topic/update",
      payload: updated,
    });
  };
};

/**
 * Close a topic
 * @param {Topic} topic
 */
actions.reOpen = (topic) => {
  return async function reOpenTopic(dispatch) {
    const updated = await topicApi.reOpen(topic._id);

    if (!updated) {
      return;
    }

    dispatch({
      type: "topic/update",
      payload: updated,
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
