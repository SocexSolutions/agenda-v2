import React from 'react';
import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import useClickAway from '../utils/clickAway';
import styles from '../styles/Button.module.css';


const Button = ({
  icon,
  text,
  size,
  onClick,
  varient,
  stretch,
  children,
  customClass
}) => {

  const [ open, setOpen ] = useState( false );

  let buttonStyles = styles.btn;
  // size cases
  switch ( size ) {
    case 'small':
      buttonStyles += ' ' + styles.small;
      break;
    case 'medium':
      buttonStyles += ' ' + styles.medium;
      break;
    case 'large':
      buttonStyles += ' ' + styles.large;
      break;
    case 'xl':
      buttonStyles += ' ' + styles.xl;
      break;
  }

  //varient case
  switch ( varient ) {
    case 'primary':
      buttonStyles += ' ' + styles.primary;
      break;
    case 'secondary':
      buttonStyles += ' ' + styles.secondary;
      break;
    case 'danger':
      buttonStyles += ' ' + styles.danger;
      break;
    case 'disabled':
      buttonStyles += ' ' + styles.disabled;
      break;
    case 'menu':
      buttonStyles += ' ' + styles.menu;
      break;
    case 'topic':
      buttonStyles += ' ' + styles.topic;
      break;
    case 'icon':
      buttonStyles += ' ' + styles.icon;
      break;

  }
  //stretch case
  switch ( stretch ) {
    case 'medium':
      buttonStyles += ' ' + styles.stretchMedium;
      break;
    case 'wide':
      buttonStyles += ' ' + styles.stretchWide;
      break;
    case false:
      break;
  }

  buttonStyles = customClass ? buttonStyles + ' ' + customClass : buttonStyles;

  const buttonRef = useRef( null );
  useClickAway( buttonRef, () => setOpen( false ) );

  return (
    <div ref={buttonRef} onClick={() => setOpen( true )}>
      <button className={buttonStyles} onClick={onClick}>
        {
          icon &&
          <div className={styles.iconContainer}>{icon}</div>
        }
        {text}
      </button>
      { open && children }
    </div>
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
  varient: 'primary'
};

export default Button;
