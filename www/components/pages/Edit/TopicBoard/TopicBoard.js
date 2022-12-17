import { Button, Fade } from "@mui/material";

import TopicCard from "../../../shared/TopicCard/TopicCard";

import meetingStore from "../../../../store/features/meeting";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import styles from "./TopicBoard.module.scss";

export default function TopicBoard({ meetingId }) {
  const dispatch = useDispatch();

  const [unsavedTopics, setUnsavedTopics] = useState([]);

  useEffect(() => {
    dispatch(meetingStore.actions.getTopics(meetingId));
  }, []);

  const topics = useSelector((state) =>
    meetingStore.selectors.topics(state, meetingId)
  );

  const sorted = topics.concat(unsavedTopics).sort((a, b) => {
    if (!a.createdAt) {
      return 1;
    } else if (!b.createdAt) {
      return -1;
    } else {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
  });

  const cards = sorted.map((topic) => {
    return (
      <TopicCard
        key={JSON.stringify(topic)}
        topic={topic}
        deleteUnsaved={(id) => {
          setUnsavedTopics(unsavedTopics.filter((t) => t._id !== id));
        }}
        className={styles.topicCard}
      />
    );
  });

  return (
    <div className={styles.topic_board}>
      <Fade in={cards.length !== 0}>
        <div className={styles.cards_container}>{cards}</div>
      </Fade>
      <Button
        variant="contained"
        color="primary"
        className={styles.addTopicButton}
        onClick={() => {
          const newTopic = {
            _id: `temp-${Math.random()}`,
            meeting_id: meetingId,
            name: "",
            description: "",
          };
          setUnsavedTopics([...unsavedTopics, newTopic]);
        }}
        disableElevation
      >
        Add Topic
      </Button>
    </div>
  );
}