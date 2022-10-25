import { createSlice } from "@reduxjs/toolkit";

import meetingApi from "../../api/meeting";
import topicApi from "../../api/topic";

const topicsSlice = createSlice({
  name: "topics",
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
      state[_id] = { ...state[_id], ...action.payload };
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

export const create = (topic) => {
  return async function create() {
    const createdTopic = await topicApi.create(topic);

    return (dispatch) => {
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
};

export const update = (id, updates) => {
  return async function update() {
    const updatedTopic = await topicApi.update(id, updates);

    return (dispatch) => {
      dispatch({
        type: "topic/update",
        payload: updatedTopic,
      });
    };
  };
};

export const destroy = (topic) => {
  return async function destroy() {
    await topicApi.destroy(topic._id);

    return (dispatch) => {
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
};

export const getMeetingTopics = (meeting_id) => {
  return async function getTopics() {
    const topics = await meetingApi.getTopics(meeting_id);

    return (dispatch) => {
      dispatch({
        type: "topic/updateMany",
        payload: { topics },
      });
      dispatch({
        type: "meeting/setTopics",
        payload: {
          _id: topics[0].meeting_id,
          topicsIds: topics.map((topic) => topic._id),
        },
      });
    };
  };
};

export default topicsSlice.reducer;
