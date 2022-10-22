import Tooltip from "@mui/material/Tooltip";
import CircleIcon from "@mui/icons-material/Circle";

import styles from "./TopicSelectBarButton.module.scss";

export default function SideBarButton({ topic, name, ...buttonProps }) {
  const classes = [styles.side_bar_button];

  if (topic.status === "closed") {
    classes.push(styles.closed);
  }

  if (topic.status === "live") {
    classes.push(styles.live);
  }

  let abbreviation;

  if (name.length > 30) {
    abbreviation = name.slice(0, 23) + "...";
  }

  const button = (
    <button className={classes.join(" ")} {...buttonProps}>
      <p className={styles.button_text}>{abbreviation || name}</p>
      <CircleIcon className={styles.icon} />
    </button>
  );

  // Only need tooltip if the name is too long
  if (abbreviation) {
    return (
      <Tooltip title={name} placement="right">
        {button}
      </Tooltip>
    );
  }

  return button;
}
