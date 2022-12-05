import { generateActions } from "../utils/slice-generator";
import { generateSelectors } from "../utils/slice-generator";

export const schema = {
  name: "actionItem",
  foreignKeys: {
    topic: "topic_id",
    meeting: "meeting_id",
  },
};

export const actions = generateActions(schema);
export const selectors = generateSelectors(schema);

export default {
  actions,
  schema,
  selectors,
};
