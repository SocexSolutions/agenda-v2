import { generateActions } from "../normalized-store/normalized-store";
import { generateSelectors } from "../normalized-store/normalized-store";

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
