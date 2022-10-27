import { createSlice } from "@reduxjs/toolkit";
import { generateSlice } from "../utils/slice-generator";
import { generateActions } from "../utils/slice-generator";
import { generateSelectors } from "../utils/slice-generator";

const meetingSchema = {
  name: "meeting",
  references: {
    topics: "topic",
    participants: "participant",
    actionItems: "actionItem",
  },
};

export const { reducer } = createSlice(generateSlice(meetingSchema));
export const actions = generateActions(meetingSchema);
export const selectors = generateSelectors(meetingSchema);

export default {
  reducer,
  actions,
  selectors,
};
