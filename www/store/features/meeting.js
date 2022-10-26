import { createSlice } from "@reduxjs/toolkit";
import { generateSlice } from "../../classes/slice-generator";
import { generateActions } from "../../classes/slice-generator";
import { generateSelectors } from "../../classes/slice-generator";

const meetingSchema = {
  name: "meeting",
  references: {
    topics: "topic._id",
    participants: "participant._id",
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
