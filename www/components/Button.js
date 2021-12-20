import React from "react";
import PropTypes from "prop-types";
import { useState } from "react";
import styles from "../styles/Button.module.css";


const Button = ({ icon, text, size, onClick, varient, stretch, children }) => {

  const [ open, setOpen ] = useState( false );

  let className = styles.btn;
  // size cases
  switch ( size ) {
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

  switch ( varient ) {
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
  case "icon":
    className += " " + styles.icon;
    break;

  }
  //stretch case
  switch ( stretch ) {
  case "medium":
    className += " " + styles.stretchMedium;
    break;
  case "wide":
    className += " " + styles.stretchWide;
    break;
  case false:
    break;
  }

  switch ( onClick ) {
  case "dropDown":
    onClick = () => setOpen( !open );
  }

  return (
    <>
      <button className={className} onClick={onClick}>
        <div className={styles.iconContainer}>
          {icon}
        </div>
        {text}
      </button>
      { open && children }
    </>
  );
};

Button.propTypes = {
  children: PropTypes.element,
  onClick: PropTypes.func,
  stretch: PropTypes.oneOfType( [
    PropTypes.string,
    PropTypes.bool
  ] ),
  varient: PropTypes.string,
  text: PropTypes.string,
  size: PropTypes.string,
  icon: PropTypes.object,
};

Button.defaultProps = {
  stretch: false,
  text: "",
  size: "medium",
  varient: "primary",
  icon: "",
};

export default Button;
