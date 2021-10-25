/* eslint-disable indent */
/* eslint-disable no-trailing-spaces */
// David
// This component has a flag icon which will have to show priority of the meetin

import styles from "../styles/MeetingNameDate.module.css";
import Input from "./Input";
import FlagIcon from "@material-ui/icons/Flag";

function MeetingNameDate( props ) {
  return (
    <div className={styles.meetingBar}>
      <FlagIcon style={{ color: "var(--agendaSecondary)", fontSize: 37 }} />
      <form className={styles.form}>
        <Input placeholder="Meeting Name" onChange={props.setMeetingName} size="xl" />
        <div className={styles.date}>
          <Input
            placeholder="mm/dd/yy hh:mm"
            type="date"
            onChange={props.setMeetingDate}
          />
        </div>
      </form>
    </div>
  );
}

export default MeetingNameDate;
