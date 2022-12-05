import { generateActions } from "../utils/slice-generator";
import { generateSelectors } from "../utils/slice-generator";

export const schema = {
  name: "participant",
  foreignKeys: {
    meeting: "meeting_id",
  },
};

export const actions = generateActions(schema);
export const selectors = generateSelectors(schema);

export default {
  schema,
  actions,
  selectors,
};
