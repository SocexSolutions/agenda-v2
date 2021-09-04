import styles from "../styles/MeetingTopics.module.css";
import Chip from "./Chip";
import Input from "./Input";
function MeetingTopics() {
  return (
    <div className={styles.topicbox}>
      <div className={styles.topicsW}>

        <h2 className={styles.topicsTitle}>Topics</h2>
        <div className={styles.topics}>
          <Chip text="Topic 1"/>
          <Chip text="Topic 2"/>
          <Chip text="Topic 3"/>
        </div>
        Add Topic
        <Input placeholder="Topic"/>
      </div>
      <br />
    </div>
  );
}

export default MeetingTopics;
