import { Button } from "@mui/material";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import AddTaskIcon from "@mui/icons-material/AddTask";

import ActionItemCard from "../ActionItemCard/ActionItemCard";
import TakeawayCard from "../TakeawayCard/TakeawayCard";

import topicStore from "../../../../store/features/topic";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import styles from "./Board.module.scss";

export default function ActionItemBoard({ liveTopic, meetingId, hidden }) {
  const dispatch = useDispatch();

  const [unsavedItems, setUnsavedItems] = useState([]);

  useEffect(() => {
    if (liveTopic) {
      dispatch(topicStore.actions.getActionItems(liveTopic._id));
    }
  }, [dispatch]);

  const actionItems = useSelector((state) =>
    topicStore.selectors.actionItems(state, liveTopic._id)
  );

  const takeaways = useSelector((state) =>
    topicStore.selectors.takeaways(state, liveTopic._id)
  );

  const sorted = actionItems.concat(takeaways, unsavedItems).sort((a, b) => {
    if (!a.created_at) {
      return 1;
    } else if (!b.created_at) {
      return -1;
    } else {
      return new Date(a.created_at) - new Date(b.created_at);
    }
  });

  const cards = sorted.map((item) => {
    if (Object.hasOwnProperty.call(item, "completed")) {
      return (
        <ActionItemCard
          className={styles.card}
          key={item._id}
          actionItem={item}
          deleteUnsaved={() => {
            setUnsavedItems(unsavedItems.filter((i) => i._id !== item._id));
          }}
        />
      );
    } else {
      return (
        <TakeawayCard
          className={styles.card}
          key={item._id}
          takeaway={item}
          deleteUnsaved={() => {
            setUnsavedItems(unsavedItems.filter((i) => i._id !== item._id));
          }}
        />
      );
    }
  });

  return (
    <div hidden={hidden} className={styles.container}>
      {cards}
      <Button
        startIcon={<AddTaskIcon color="blue" />}
        className={`${styles.add_button}`}
        size="large"
        onClick={() => {
          const newActionItem = {
            _id: `temp-${Math.random()}`,
            meeting_id: meetingId,
            topic_id: liveTopic._id,
            name: "",
            description: "",
            assigned_to: [],
            completed: false,
          };
          setUnsavedItems([...unsavedItems, newActionItem]);
        }}
      >
        Add Action Item
      </Button>
      <Button
        startIcon={<LightbulbIcon color="yellow" />}
        className={`${styles.add_button}`}
        size="large"
        onClick={() => {
          const newTakeaway = {
            _id: `temp-${Math.random()}`,
            meeting_id: meetingId,
            topic_id: liveTopic._id,
            name: "",
            description: "",
          };
          setUnsavedItems([...unsavedItems, newTakeaway]);
        }}
      >
        Add Takeaway
      </Button>
    </div>
  );
}
