import { generateActions } from "../utils/slice-generator";
import { generateSelectors } from "../utils/slice-generator";
import topicApi from "../../api/topic";

export const schema = {
  name: "topic",
  references: ["actionItem", "takeaway"],
  foreignKeys: {
    meeting: "meeting_id",
  },
};

export const actions = generateActions(schema);

export const selectors = generateSelectors(schema);

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
      type: "normalized/topic/update",
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
        type: "normalized/topic/update",
        payload: res.switchedTo,
      });
    }

    if (res.switchedFrom) {
      dispatch({
        type: "normalized/topic/update",
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
      type: "normalized/topic/update",
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
      type: "normalized/topic/update",
      payload: updated,
    });
  };
};

export default {
  schema,
  actions,
  selectors,
};
