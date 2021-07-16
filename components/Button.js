import PropTypes from "prop-types";
import { render } from "react-dom";
import styles from "../styles/Button.module.css";

const Button = ({
  text,
  size,
  onClick,
  varient,
  stretch,
}) => {
  Button.propTypes = {
    onClick: PropTypes.func,
    stretch: PropTypes.bool,
    varient: PropTypes.string,
    text: PropTypes.string,
    size: PropTypes.string,
  };

  Button.defaultProps = {
    stretch: false,
    text: "Button Text",
    size: "medium",
    varient: "primary"
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
  //varients
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
  }
  //stretch case
  if(stretch == true){
    className += " " + styles.stretch;
  }
  // if (size === 'large'){
  //   className += ' ' + styles.large
  // }
  return (
    <button
      className={className}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
