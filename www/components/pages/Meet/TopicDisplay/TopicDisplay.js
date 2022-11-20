import styles from "./TopicDisplay.module.scss";

import { useDispatch } from "react-redux";

import topicStore from "../../../../store/features/topic";

import { Button } from "@mui/material";
import { Fade } from "@mui/material";

export default function TopicDisplay({ topic }) {
  const dispatch = useDispatch();

  return (
    <Fade in={!!topic}>
      <div className={styles.topic_card}>
        {topic && (
          <div className={styles.topic}>
            <h2 className={styles.topic_name}>{topic.name}</h2>
            <p className={styles.topic_description}>{topic.description}</p>
            <Button
              variant="contained"
              disableElevation
              size="small"
              onClick={() => {
                dispatch(topicStore.actions.close(topic));
              }}
            >
              Close
            </Button>
          </div>
        )}
      </div>
    </Fade>
  );
}
