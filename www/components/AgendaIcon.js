import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import AccessAlarmRoundedIcon   from '@mui/icons-material/AccessAlarmRounded';

import styles from '../styles/AgendaIcon.module.css';

function AgendaIcon() {
  return (
    <div className={styles.container}>
      <CalendarTodayRoundedIcon style={{ fontSize: 35 }}/>
      <div className={styles.check}>
        <AccessAlarmRoundedIcon style={{ fontSize: 17 }}/>
      </div>
    </div>
  );
}

export default AgendaIcon;
