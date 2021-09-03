import CalendarTodayRoundedIcon from '@material-ui/icons/CalendarTodayRounded';
import AccessAlarmRoundedIcon from '@material-ui/icons/AccessAlarmRounded';
import styles from "../styles/AgendaIcon.module.css"
function AgendaIcon() {
    return (
        <div className={styles.contain}>
            <CalendarTodayRoundedIcon style={{fontSize: 35,
            color: "var(--agendaSecondary)"}}/>
            <div className={styles.check}>
                <AccessAlarmRoundedIcon style={{fontSize: 17, 
                    color: "var(--agendaSecondary)"}}/>
            </div>
        </div>
    )
}

export default AgendaIcon
