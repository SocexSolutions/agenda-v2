import { createSlice } from "@reduxjs/toolkit";
import { generateSlice } from "../utils/slice-generator";
import { generateActions } from "../utils/slice-generator";

const takeawaySchema = {
  name: "takeaway",
  dependencies: {
    topic: "topic_id",
    meeting: "meeting_id",
  },
};

export const { reducer } = createSlice(generateSlice(takeawaySchema));
export const actions = generateActions(takeawaySchema);
export const selectors = {};

export default {
  actions,
  reducer,
  selectors,
};
