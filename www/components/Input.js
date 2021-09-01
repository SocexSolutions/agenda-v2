import React from "react";
import styles from "../styles/LogReg.module.css";
import PropTypes from "prop-types";

const Input = ({
  label,
  placeholder,
  onChange,
  value,
  name,
  id,
  size,
  required,
  varient,
}) => {
  Input.propTypes = {
    onChange: PropTypes.func,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    name: PropTypes.string,
    id: PropTypes.string,
    size: PropTypes.number,
    required: PropTypes.bool,
    varient: PropTypes.string,
  };

  Input.defaultProps = {
    label: "",
    placeholder: "",
    size: "20",
    varient: "default"
  };

  let className = "";

  //size cases
  switch ( size ) {
  case "xs":
    size = "15";
    break;
  case "small":
    size = "20";
    break;
  case "medium":
    size = "30";
    break;
  case "large":
    size = "40";
    break;
  case "xl":
    size = "50";
    break;
  }

  //required cases
  switch ( required ) {
  case true:
    required = " *";
    break;
  case false:
    required = "";
    break;
  }

  //varient cases
  switch ( varient ) {
  case "default":
    className += " " + styles.default;
    break;
  case "outlined":
    className += " " + styles.outlined;
    break;
  }

  return (
    <div>
      <label>
        {label}
        {required}
      </label>
      <input
        placeholder={placeholder}
        value={value}
        name={name}
        id={id}
        onChange={onChange}
        size={size}
        className={className}
      />
    </div>
  );
};

export default Input;
