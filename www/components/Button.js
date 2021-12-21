import React from 'react';
import PropTypes from 'prop-types';
import { useState } from 'react';
import styles from '../styles/Button.module.css';


const Button = ({
  icon,
  text,
  size,
  onClick,
  varient,
  stretch,
  children,
  className
}) => {

  const [ open, setOpen ] = useState( false );

  let classNames = styles.btn;
  // size cases
  switch ( size ) {
    case 'small':
      classNames += ' ' + styles.small;
      break;
    case 'medium':
      classNames += ' ' + styles.medium;
      break;
    case 'large':
      classNames += ' ' + styles.large;
      break;
    case 'xl':
      classNames += ' ' + styles.xl;
      break;
  }

  //varient case
  switch ( varient ) {
    case 'primary':
      classNames += ' ' + styles.primary;
      break;
    case 'secondary':
      classNames += ' ' + styles.secondary;
      break;
    case 'danger':
      classNames += ' ' + styles.danger;
      break;
    case 'disabled':
      classNames += ' ' + styles.disabled;
      break;
    case 'menu':
      classNames += ' ' + styles.menu;
      break;
    case 'topic':
      classNames += ' ' + styles.topic;
      break;
    case 'icon':
      classNames += ' ' + styles.icon;
      break;

  }
  //stretch case
  switch ( stretch ) {
    case 'medium':
      classNames += ' ' + styles.stretchMedium;
      break;
    case 'wide':
      classNames += ' ' + styles.stretchWide;
      break;
    case false:
      break;
  }

  classNames = className ? classNames + ' ' + className : classNames;

  switch ( onClick ) {
    case 'dropDown':
      onClick = () => setOpen( !open );
  }

  return (
    <>
      <button className={classNames} onClick={onClick}>
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
  stretch: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool
  ]),
  varient: PropTypes.string,
  text: PropTypes.string,
  size: PropTypes.string,
  icon: PropTypes.any
};

Button.defaultProps = {
  stretch: false,
  text: '',
  size: 'medium',
  varient: 'primary',
  icon: ''
};

export default Button;
