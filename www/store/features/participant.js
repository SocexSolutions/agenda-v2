import { createSlice } from "@reduxjs/toolkit";
import { generateSlice } from "../utils/slice-generator";
import { generateActions } from "../utils/slice-generator";
import { generateSelectors } from "../utils/slice-generator";

const participantSchema = {
  name: "participant",
  dependencies: {
    meeting: "meeting_id",
  },
};

export const { reducer } = createSlice(generateSlice(participantSchema));
export const actions = generateActions(participantSchema);
export const selectors = generateSelectors(participantSchema);

export default {
  actions,
  reducer,
  selectors,
};
