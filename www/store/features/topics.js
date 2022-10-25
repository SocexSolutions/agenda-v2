import { createSlice } from "@reduxjs/toolkit";

import meetingApi from "../../api/meeting";

const topicsSlice = createSlice({
  name: "topics",
  initialState: {
    byMeeting: {},
  },
  reducers: {
    meetingTopics: (state, action) => {
      state.byMeeting = { ...state.byMeeting, ...action.payload };
    },
  },
});

export const getMeetingTopics = (meeting_id) => {
  return async function getTopics(dispatch) {
    const topics = await meetingApi.getTopics(meeting_id);

    const topicMap = topics.reduce((acc, topic) => {
      acc[topic._id] = topic;
      return acc;
    }, {});

    dispatch({
      type: "topics/meetingTopics",
      payload: { [meeting_id]: topicMap },
    });
  };
};

export const selectMeetingTopics = (state, meeting_id) => {
  return state.topics.byMeeting[meeting_id];
};

export default topicsSlice.reducer;
