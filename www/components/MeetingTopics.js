import styles from "../styles/MeetingTopics.module.css";
import Chip from "./Chip";
import Input from "./Input";

function MeetingTopics( props ) {
  return (
    <div className={styles.container}>
      <h2 className={styles.topicsTitle}>Topics</h2>
      <div className={styles.topics}>
        <Chip text={ props.topics ? props.topics[0] : ""} />
        <Chip text="Topic 2" />
        <Chip text="Topic 3" />
      </div>
      <p>Add Topic</p>
      <Input
        placeholder="Topic"
        onChange={() => alert( "NOTICE: You are editing your topics" )}
      />
    </div>
  );
}

export default MeetingTopics;
