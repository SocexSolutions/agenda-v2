import TopicSelectBarButton from "./TopicSelectBarButton/TopicSelectBarButton";

import { Fade } from "@mui/material";

import styles from "./TopicSelectBar.module.scss";

export default function SideBar({ topics, meetingName, switchToTopic }) {
  const totalLikes = topics.reduce((total, t) => {
    total += t.likes.length;

    return total;
  }, 0);

  const avg = totalLikes / topics.length;

  const sorted = topics.sort((a, b) => b.likes.length - a.likes.length);

  return (
    <Fade in={!!topics && !!meetingName}>
      <div className={styles.side_bar}>
        <h3>Meeting Topics</h3>
        <div className={styles.button_container}>
          {sorted.map((topic) => {
            const priority = topic.likes.length / avg;

            return (
              <TopicSelectBarButton
                topic={topic}
                priority={priority}
                onClick={() => switchToTopic(topic)}
                key={topic.name}
                name={topic.name}
              />
            );
          })}
        </div>
      </div>
    </Fade>
  );
}
