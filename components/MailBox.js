import styles from "../styles/Inbox.module.css";
import Button from "../components/Button";

import AccountCircleIcon from "@material-ui/icons/AccountCircle";

const MailBox = () => {
  return (
    <div className={styles.mailBoxContainer}>
      <h1>Bacon Proposal</h1>
      <h4>May 15th @3:30</h4>
      <div className={styles.mailBoxContentContainer}>
        <div className={styles.topicsContainer}>
          <h2>Topics</h2>
          <div>
            <Button varient="topic" size="large" text="Bacon Fat" />
            <Button varient="topic" size="large" text="Beef Fat" />
            <Button varient="topic" size="large" text="Liver Fat" />
          </div>
        </div>
        <div className={styles.participantsContainer}>
          <h5>Owner(s)</h5>
          <div>
            <AccountCircleIcon className={styles.icons} />
          </div>
          <h5>Participant(s)</h5>
          <div>
            <AccountCircleIcon className={styles.icons} />
            <AccountCircleIcon className={styles.icons} />
            <AccountCircleIcon className={styles.icons} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MailBox;
