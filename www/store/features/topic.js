import { createSlice } from "@reduxjs/toolkit";
import topicApi from "../../api/topic";

const topicsSlice = createSlice({
  name: "topic",
  initialState: {},
  reducers: {
    create: (state, action) => {
      state[action.payload._id] = {
        takeaways: [],
        actionItems: [],
        ...action.payload,
      };
    },
    update: (state, action) => {
      const { _id } = action.payload;

      // merge to avoid overwriting action items or takeaways
      state[_id] = {
        takeways: [],
        actionItems: [],
        ...state[_id],
        ...action.payload,
      };
    },
    delete: (state, action) => {
      delete state[action.payload._id];
    },
    updateMany: (state, action) => {
      action.payload.forEach((topic) => {
        // merge to avoid overwriting action items or takeaways
        state[topic._id] = {
          takeaways: [],
          actionItems: [],
          ...state[topic._id],
          ...topic,
        };
      });
    },
    setTakeaways: (state, action) => {
      const { _id, takeawayIds } = action.payload;

      state[_id].takeaways = takeawayIds;
    },
    createTakeaway: (state, action) => {
      const { _id, takeawayId } = action.payload;

      state[_id].takeaways = state[_id].takeaways.push(takeawayId);
    },
    deleteTakeaway: (state, action) => {
      const { _id, takeawayId } = action.payload;

      state[_id].takeaways = state[_id].takeaways.filter(
        (t) => t !== takeawayId
      );
    },
    setActionItems: (state, action) => {
      const { _id, actionItemIds } = action.payload;

      state[_id].actionItems = actionItemIds;
    },
    createActionItem: (state, action) => {
      const { _id, actionItemId } = action.payload;

      state[_id].actionItems = state[_id].actionItems.push(actionItemId);
    },
    deleteActionItem: (state, action) => {
      const { _id, actionItemId } = action.payload;

      state[_id].actionItems = state[_id].actionItems.filter(
        (t) => t !== actionItemId
      );
    },
  },
});

/**
 * Create a topic
 * @param {Topic} topic
 */
export const create = (topic) => {
  return async function create(dispatch) {
    const createdTopic = await topicApi.create(topic);

    dispatch({
      type: "topic/create",
      payload: createdTopic,
    });
    dispatch({
      type: "meeting/createTopic",
      payload: {
        _id: createdTopic.meeting_id,
        topicId: createdTopic._id,
      },
    });
  };
};

/**
 * Update a topic
 * @param {Topic} topic
 */
export const update = (topic) => {
  return async function update(dispatch) {
    const updatedTopic = await topicApi.update(topic._id, topic);

    dispatch({
      type: "topic/update",
      payload: updatedTopic,
    });
  };
};

/**
 * Delete a topic
 * @param {Topic} topic
 */
export const destroy = (topic) => {
  return async function destroy(dispatch) {
    await topicApi.destroy(topic._id);

    dispatch({
      type: "topic/delete",
      payload: topic,
    });
    dispatch({
      type: "meeting/deleteTopic",
      payload: {
        _id: topic.meeting_id,
        topicId: topic._id,
      },
    });
  };
};

/**
 * Like a topic
 * @param {Topic} topic
 */
export const like = (topic) => {
  return async function like(dispatch) {
    const updatedTopic = await topicApi.like(topic._id);

    dispatch({
      type: "topic/update",
      payload: updatedTopic,
    });
  };
};

export default topicsSlice.reducer;
