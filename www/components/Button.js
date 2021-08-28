import PropTypes from "prop-types";
import styles from "../styles/Button.module.css";

import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import CheckBoxOutlinedIcon from "@material-ui/icons/CheckBoxOutlined";
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

const Button = ({ icon, text, size, onClick, varient, stretch }) => {
  Button.propTypes = {
    onClick: PropTypes.func,
    stretch: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool
    ]),
    varient: PropTypes.string,
    text: PropTypes.string,
    size: PropTypes.string,
    icon: PropTypes.string,
  };

  Button.defaultProps = {
    stretch: false,
    text: "Button Text",
    size: "medium",
    varient: "primary",
    icon: "",
  };

  let className = styles.btn;
  // size cases
  switch (size) {
    case "small":
      className += " " + styles.small;
      break;
    case "medium":
      className += " " + styles.medium;
      break;
    case "large":
      className += " " + styles.large;
      break;
    case "xl":
      className += " " + styles.xl;
      break;
  }
  //varient case
  switch (varient) {
    case "primary":
      className += " " + styles.primary;
      break;
    case "secondary":
      className += " " + styles.secondary;
      break;
    case "danger":
      className += " " + styles.danger;
      break;
    case "disabled":
      className += " " + styles.disabled;
      break;
    case "menu":
      className += " " + styles.menu;
      break;
    case "topic":
      className += " " + styles.topic;
      break;
  }
  //stretch case
  switch (stretch) {
    case "medium":
      className += " " + styles.stretchMedium;
      break;
    case "wide":
      className += " " + styles.stretchWide;
      break;
    case false:
      break;
  }
  //icons
  switch (icon) {
    case "doubleArrow":
      icon = <DoubleArrowIcon style={{ color: "var(--agendaPurple)" }} />;
      break;
    case "checkBox":
      icon = <CheckBoxOutlinedIcon style={{ color: "var(--agendaGreen)" }} />;
      break;
    case "cancel":
      icon = <CancelOutlinedIcon style={{ color: "var(--danger)" }} />;
      break;
    case "arrow":
      icon = <ArrowForwardIosIcon style={{ fontSize: "medium", color: "var(--textBlue)"}}/>;
      break;
  }

  return (
    <button className={className} onClick={onClick}>
      {icon}
      {text}
    </button>
  );
};

export default Button;
