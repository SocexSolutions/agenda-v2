import styles from "../styles/MeetingTopics.module.css";
import Chip from "./Chip";
import Input from "./Input";

function MeetingTopics() {
  return (
    <div className={styles.container}>
      <h2 className={styles.topicsTitle}>Topics</h2>
      <div className={styles.topics}>
        <Chip text="Topic 1"/>
        <Chip text="Topic 2"/>
        <Chip text="Topic 3"/>
      </div>
      <p>Add Topic</p>
      <Input placeholder="Topic"/>
    </div>
  );
}

export default MeetingTopics;
