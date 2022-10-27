import { createSlice } from "@reduxjs/toolkit";
import { generateSlice } from "../utils/slice-generator";
import { generateActions } from "../utils/slice-generator";
import { generateSelectors } from "../utils/slice-generator";

const actionItemSchema = {
  name: "actionItem",
  dependencies: {
    topic: "topic_id",
    meeting: "meeting_id",
  },
};

export const { reducer } = createSlice(generateSlice(actionItemSchema));
export const actions = generateActions(actionItemSchema);
export const selectors = generateSelectors(actionItemSchema);

export default {
  actions,
  reducer,
  selectors,
};
