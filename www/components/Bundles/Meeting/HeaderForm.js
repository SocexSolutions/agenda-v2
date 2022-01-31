
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
      </form>
    </div>
  );
}

export default HeaderForm;
