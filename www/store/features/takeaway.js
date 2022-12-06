import { generateActions } from "../normalized-store/normalized-store";
import { generateSelectors } from "../normalized-store/normalized-store";

const schema = {
  name: "takeaway",
  foreignKeys: {
    topic: "topic_id",
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
