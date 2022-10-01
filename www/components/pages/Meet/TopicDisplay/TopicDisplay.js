import styles from './TopicDisplay.module.scss';

import { Fade } from '@mui/material';

export default function TopicDisplay({ topic }) {
  return (
    <Fade in={!!topic}>
      <div className={styles.topic_container}>
        {topic && (
          <div className={styles.topic}>
            <h1 className={styles.topic_name}>{topic.name}</h1>
            <p className={styles.topic_description}>{topic.description}</p>
          </div>
        )}
      </div>
    </Fade>
  );
}
