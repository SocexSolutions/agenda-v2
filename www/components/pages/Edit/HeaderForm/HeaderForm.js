import { TextField }         from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

import styles from './HeaderForm.module.css';

function HeaderForm({
  meetingName,
  setMeetingName,
  meetingDate,
  setMeetingDate
}) {
  return (
    <div className={styles.meetingBar}>
      <form className={styles.form}>
        <TextField
          className={styles.name_field}
          label="Meeting Name"
          size="small"
          value={meetingName}
          placeholder="Meeting Name"
          onChange={setMeetingName}
        />
        <DesktopDatePicker
          className={styles.date_picker}
          label="Meeting Date"
          value={meetingDate}
          onChange={setMeetingDate}
          renderInput={
            ( params ) => {
              return (
                <TextField
                  {...params}
                  size="small"
                />
              );
            }
          }
        />
      </form>
    </div>
  );
}

export default HeaderForm;
