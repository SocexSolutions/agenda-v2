import { Button } from "@mui/material";
import { Fade } from "@mui/material";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import AddTaskIcon from "@mui/icons-material/AddTask";

import ActionItemCard from "../ActionItemCard/ActionItemCard";
import TakeawayCard from "../TakeawayCard/TakeawayCard";

import topicStore from "../../../../store/features/topic";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import styles from "./Board.module.scss";

export default function Board({ selectedTopic, meetingId }) {
  const dispatch = useDispatch();

  const [unsavedItems, setUnsavedItems] = useState([]);

  const fetchData = () => {
    dispatch(topicStore.actions.getActionItems(selectedTopic._id));
    dispatch(topicStore.actions.getTakeaways(selectedTopic._id));
  };

  useEffect(() => {
    let interval;

    if (selectedTopic) {
      fetchData();

      interval = setInterval(() => {
        fetchData();
      }, 1000 + Math.random() * 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [selectedTopic._id]);

  const actionItems = useSelector((state) =>
    topicStore.selectors.actionItems(state, selectedTopic._id)
  );

  const takeaways = useSelector((state) =>
    topicStore.selectors.takeaways(state, selectedTopic._id)
  );

  const sorted = actionItems.concat(takeaways, unsavedItems).sort((a, b) => {
    if (!a.createdAt) {
      return 1;
    } else if (!b.createdAt) {
      return -1;
    } else {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
  });

  const cards = sorted.map((item) => {
    if (Object.hasOwnProperty.call(item, "completed")) {
      return (
        <ActionItemCard
          className={styles.card}
          key={JSON.stringify(item)}
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
          key={JSON.stringify(item)}
          takeaway={item}
          deleteUnsaved={() => {
            setUnsavedItems(unsavedItems.filter((i) => i._id !== item._id));
          }}
        />
      );
    }
  });

  return (
    <Fade in={selectedTopic !== null}>
      <div className={styles.container}>
        {cards}
        <Button
          startIcon={<AddTaskIcon color="blue" />}
          className={`${styles.add_button}`}
          size="large"
          onClick={() => {
            const newActionItem = {
              _id: `temp-${Math.random()}`,
              meeting_id: meetingId,
              topic_id: selectedTopic._id,
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
              topic_id: selectedTopic._id,
              name: "",
              description: "",
            };
            setUnsavedItems([...unsavedItems, newTakeaway]);
          }}
        >
          Add Takeaway
        </Button>
      </div>
    </Fade>
  );
}
