import Tooltip from "@mui/material/Tooltip";

import CircleIcon from "@mui/icons-material/Circle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import styles from "./TopicSelectBarButton.module.scss";

export default function TopicSelectBarButton({
  topic,
  selectedTopic,
  name,
  priority,
  ...buttonProps
}) {
  const classes = [styles.side_bar_button];
  const iconCls = [styles.icon];

  if (topic.status === "closed") {
    classes.push(styles.closed);
  }

  if (selectedTopic && selectedTopic._id === topic._id) {
    classes.push(styles.selected);
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

  let icon;
  if (topic.status === "closed") {
    icon = <CheckCircleIcon className={iconCls.join(" ")} />;
  } else {
    icon = <CircleIcon className={iconCls.join(" ")} />;
  }

  const button = (
    <button className={classes.join(" ")} {...buttonProps}>
      <p className={styles.button_text}>{abbreviation || name}</p>
      {icon}
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
