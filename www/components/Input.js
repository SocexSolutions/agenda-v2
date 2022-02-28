import React from 'react';
import styles from '../styles/Input.module.css';
import PropTypes from 'prop-types';

const Input = ({
  label,
  placeholder,
  onChange,
  value,
  name,
  id,
  size,
  required,
  variant,
  onKeyPress,
  type
}) => {

  let classNames = '';

  //size cases
  switch ( size ) {
    case 'xs':
      size = '15';
      break;
    case 'small':
      size = '20';
      break;
    case 'medium':
      size = '30';
      break;
    case 'large':
      size = '40';
      break;
    case 'xl':
      size = '50';
      break;
  }

  //required cases
  switch ( required ) {
    case true:
      required = ' *';
      break;
    case false:
      required = '';
      break;
  }

  //variant cases
  switch ( variant ) {
    case 'default':
      classNames += ' ' + styles.default;
      break;
    case 'outlined':
      classNames += ' ' + styles.outlined;
      break;
  }

  return (
    <div className={styles.wrapper}>
      <label>
        {label}
        {required}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        name={name}
        id={id}
        onChange={onChange}
        size={size}
        className={classNames}
        onKeyPress={onKeyPress}
      />
    </div>
  );
};

Input.propTypes = {
  onChange: PropTypes.func,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  size: PropTypes.string,
  required: PropTypes.bool,
  variant: PropTypes.string,
  type: PropTypes.string
};

Input.defaultProps = {
  type: '',
  label: '',
  placeholder: '',
  size: '20',
  variant: 'default'
};

export default Input;
