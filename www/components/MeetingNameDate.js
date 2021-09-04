/* eslint-disable indent */
/* eslint-disable no-trailing-spaces */
// David
// This component has a flag icon which is white while meeting
// is being edited and red when saved,
// a meeting title and a date

import styles from "../styles/MeetingNameDate.module.css";
import Input from "./Input";
import FlagIcon from "@material-ui/icons/Flag";


function MeetingNameDate() {
  return (
    <div className={styles.meetingBar}>
      <FlagIcon style={{ color: "var(--agendaSecondary)", fontSize: 37 }}/>
      <form className={styles.form}>
          <div>
            <Input placeholder="Meeting Name" />
          </div>
          <div className={styles.date}>
            <Input placeholder="mm/dd/yy hh:mm"  />
          </div>
      </form>
    </div>
  );
}

export default MeetingNameDate;
