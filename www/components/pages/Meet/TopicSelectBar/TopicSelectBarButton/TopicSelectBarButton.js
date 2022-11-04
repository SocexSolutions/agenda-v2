import Tooltip from "@mui/material/Tooltip";
import CircleIcon from "@mui/icons-material/Circle";

import styles from "./TopicSelectBarButton.module.scss";

export default function TopicSelectBarButton({
  topic,
  name,
  priority,
  ...buttonProps
}) {
  const classes = [styles.side_bar_button];
  const iconCls = [styles.icon];

  if (topic.status === "closed") {
    classes.push(styles.closed);
  }

  if (topic.status === "live") {
    classes.push(styles.live);
  }

  if (priority > 1.5) {
    iconCls.push(styles.icon_high);
  } else if (priority > 0.5) {
    iconCls.push(styles.icon_med);
  } else {
    iconCls.push(styles.icon_low);
  }

  let abbreviation;

  if (name.length > 30) {
    abbreviation = name.slice(0, 23) + "...";
  }

  const button = (
    <button className={classes.join(" ")} {...buttonProps}>
      <p className={styles.button_text}>{abbreviation || name}</p>
      <CircleIcon className={iconCls.join(" ")} />
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
