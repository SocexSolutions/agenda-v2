import { useSelector } from "react-redux";

import Button from "@mui/material/Button";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

import { useRouter } from "next/router";

import styles from "./Drawer.module.scss";

const selectDrawer = (state) => state.drawer;
const selectUser = (state) => state.user;

const Drawer = () => {
  const open = useSelector(selectDrawer).open;
  const router = useRouter();
  const user = useSelector(selectUser);

  return (
    <div className={styles.container}>
      <div className={`${styles.drawer} ${!open && styles.closed}`}>
        <Button
          startIcon={<CalendarMonthIcon />}
          variant="text"
          size="large"
          className={styles.icon_button + " " + styles.green}
          onClick={() => router.push(`/user/${user._id}/home`)}
        >
          Meetings
        </Button>
        <Button
          startIcon={<TaskAltIcon />}
          variant="text"
          size="large"
          className={styles.icon_button + " " + styles.blue}
          onClick={() => router.push(`/user/${user._id}/tasks`)}
        >
          Action items
        </Button>
      </div>
    </div>
  );
};

export default Drawer;
