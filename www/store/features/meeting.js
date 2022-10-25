import { createSlice } from "@reduxjs/toolkit";
import meetingApi from "../../api/meeting";

const meetingsSlice = createSlice({
  name: "meeting",
  initialState: {},
  reducers: {
    create: (state, action) => {
      state[action.payload._id] = {
        topics: [],
        ...action.payload,
      };
    },
    update: (state, action) => {
      const { _id } = action.payload;

      // merge to avoid overwriting topics
      state[_id] = { topics: [], ...state[_id], ...action.payload };
    },
    delete: (state, action) => {
      delete state[action.payload._id];
    },
    setTopics: (state, action) => {
      const { _id, topicIds } = action.payload;

      state[_id].topics = topicIds;
    },
    createTopic: (state, action) => {
      const { _id, topicId } = action.payload;

      state[_id].topics = state[_id].topics.push(topicId);
    },
    deleteTopic: (state, action) => {
      const { _id, topicId } = action.payload;

      state[_id].topics = state[_id].topics.filter((t) => t !== topicId);
    },
  },
});

/**
 * Get a meeting
 */
export const getMeeting = (meetingId) => {
  return async function getMeeting(dispatch) {
    const meeting = await meetingApi.get(meetingId);

    dispatch({
      type: "meeting/update",
      payload: meeting,
    });
  };
};

/**
 * Get a meeting's topics using it's id
 * @param {string} meeting_id - if of meeting to get topics for
 */
export const getMeetingTopics = (meeting_id) => {
  return async function getTopics(dispatch) {
    const topics = await meetingApi.getTopics(meeting_id);

    dispatch({
      type: "topic/updateMany",
      payload: topics,
    });
    dispatch({
      type: "meeting/setTopics",
      payload: {
        _id: topics[0].meeting_id,
        topicIds: topics.map((topic) => topic._id),
      },
    });
  };
};

/**
 * Select a meeting
 */
export const selectMeeting = (state, meeting_id) => {
  if (!meeting_id || !state.meeting[meeting_id]) {
    return null;
  }

  return state.meeting[meeting_id];
};

/**
 * Select a meeting's topics from the store
 */
export const selectMeetingTopics = (state, meeting_id) => {
  if (!meeting_id || !state.meeting[meeting_id]) {
    return [];
  }

  const ids = state.meeting[meeting_id].topics;

  return ids.map((id) => state.topic[id]);
};

export default meetingsSlice.reducer;
