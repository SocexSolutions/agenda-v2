import styles from "./TopicDisplay.module.scss";

import { Button } from "@mui/material";
import { Fade } from "@mui/material";

export default function TopicDisplay({
  topic,
  closeTopic,
  reOpenTopic,
  hideTopic,
}) {
  return (
    <Fade in={!!topic}>
      <div className={styles.topic_card}>
        {topic && (
          <div className={styles.topic}>
            <h2 className={styles.topic_name}>{topic.name}</h2>
            {topic.description && (
              <p className={styles.topic_description}>{topic.description}</p>
            )}
            <div className={styles.button_container}>
              {topic.status !== "closed" && (
                <Button
                  variant="contained"
                  disableElevation
                  size="small"
                  onClick={() => closeTopic(topic)}
                >
                  Close
                </Button>
              )}
              {topic.status === "closed" && (
                <Button
                  variant="contained"
                  disableElevation
                  size="small"
                  onClick={() => reOpenTopic(topic)}
                >
                  Reopen
                </Button>
              )}
              <Button disableElevation size="small" onClick={() => hideTopic()}>
                Hide
              </Button>
            </div>
          </div>
        )}
      </div>
    </Fade>
  );
}
