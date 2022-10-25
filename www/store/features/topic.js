import { createSlice } from "@reduxjs/toolkit";

import meetingApi from "../../api/meeting";
import topicApi from "../../api/topic";

const topicsSlice = createSlice({
  name: "topics",
  initialState: {},
  reducers: {
    create: (state, action) => {
      state[action.payload._id] = action.payload;
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
        state[topic._id] = { ...state[topic._id], ...topic };
      });
    },
    updateTakeaways: (state, action) => {
      const { _id, takeawayIds } = action.payload;

      state[_id].takeaways = takeawayIds;
    },
  },
});

export const createTopic = (topic) => {
  return async function create() {
    const newTopic = await topicApi.create(topic);

    return (dispatch) => {
      dispatch({
        type: "topic/create",
        payload: newTopic,
      });
      dispatch({
        type: "meeting/createTopic",
        payload: {
          _id: newTopic.meeting_id,
          topicId: newTopic._id,
        },
      });
    };
  };
};

export const updateTopic = (id, updates) => {
  return async function update() {
    const updatedTopic = await topicApi.update(id, updates);

    return (dispatch) => {
      dispatch({
        type: "topic/update",
        payload: updatedTopic,
      });
      dispatch({
        type: "meeting/updateTopic",
        payload: {
          _id: updatedTopic.meeting_id,
          topicId: updatedTopic._id,
        },
      });
    };
  };
};

export const deleteTopic = (topic) => {
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
        type: "meeting/updateTopics",
        payload: {
          _id: topics[0].meeting_id,
          topicsIds: topics.map((topic) => topic._id),
        },
      });
    };
  };
};

export default topicsSlice.reducer;
