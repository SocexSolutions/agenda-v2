
import styles from '../../../styles/Bundles/Meeting/HeaderForm.module.css';
import Input from '../../Input';

function HeaderForm( props ) {
  return (
    <div className={styles.meetingBar}>
      <form className={styles.form}>
        <Input
          value={ props.meetingName }
          placeholder="Meeting Name"
          onChange={props.setMeetingName}
          size="xl"
        />
        <div className={styles.date}>
          {/* <Input
            value={ props.meetingDate }
            placeholder="mm/dd/yy hh:mm"
            type="datetime-local"
            onChange={props.setMeetingDate}
          /> */}
        </div>
      </form>
    </div>
  );
}

export default HeaderForm;
