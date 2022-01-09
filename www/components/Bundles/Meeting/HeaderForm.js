
import styles from '../../../styles/Bundles/Meeting/HeaderForm.module.css';
import Input from '../../Input';
import FlagIcon from '@material-ui/icons/Flag';

function HeaderForm( props ) {
  return (
    <div className={styles.meetingBar}>
      <FlagIcon style={{ color: 'var(--agendaSecondary)', fontSize: 37 }} />
      <form className={styles.form}>
        <Input
          placeholder="Meeting Name"
          onChange={props.setMeetingName}
          size="xl"
        />
        <div className={styles.date}>
          <Input
            placeholder="mm/dd/yy hh:mm"
            type="datetime-local"
            onChange={props.setMeetingDate}
          />
        </div>
      </form>
    </div>
  );
}

export default HeaderForm;
