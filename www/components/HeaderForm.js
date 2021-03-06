
import Input from './Input';

import styles from '../styles/components/HeaderForm.module.css';

function HeaderForm( props ) {
  return (
    <div className={styles.meetingBar}>
      <form className={styles.form}>
        <Input
          value={props.meetingName}
          placeholder="Meeting Name"
          onChange={props.setMeetingName}
          size="xl"
        />
      </form>
    </div>
  );
}

export default HeaderForm;
