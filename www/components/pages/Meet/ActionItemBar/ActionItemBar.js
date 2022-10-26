import { useEffect, useState } from "react";

import { Checkbox } from "@mui/material";

import { useSelector, useDispatch } from "react-redux";

import actionItemStore from "../../../../store/features/action-item";
import meetingStore from "../../../../store/features/meeting";

import styles from "./ActionItemBar.module.scss";

export default function ActionItemBar({ meetingId }) {
  const dispatch = useDispatch();

  const [initialized, setInitialized] = useState(false);

  const actionItems = useSelector((state) =>
    meetingStore.selectors.actionItems(state, meetingId)
  );

  useEffect(() => {
    if (!initialized && meetingId) {
      dispatch(meetingStore.actions.getActionItems(meetingId));
      setInitialized(true);
    }
  }, [meetingId]);

  const actionItemsMarkup =
    actionItems.length > 0 ? (
      actionItems.map((actionItem) => {
        return (
          <div className={styles.action_item} key={actionItem._id}>
            <Checkbox
              onClick={(e) =>
                dispatch(
                  actionItemStore.actions.update({
                    ...actionItem,
                    completed: e.target.checked,
                  })
                )
              }
              checked={actionItem.completed}
            />
            <p>{actionItem.name}</p>
          </div>
        );
      })
    ) : (
      <p>No action items.</p>
    );

  return (
    <div className={styles.action_item_bar}>
      <h3>Meeting Action Items</h3>
      {actionItemsMarkup}
    </div>
  );
}
