import React     from 'react';
import PropTypes from 'prop-types';

import { useRef, useState } from 'react';

import useClickAway from '../utils/clickAway';

import styles from '../styles/components/Button.module.css';

/**
 * @param {Icon} icon - icon for the button
 * @param {String} text - text to be displayed in button
 * @param {String} size - size of button
 * @param {Function} onClick - click handler
 * @param {String} variant - button variant [outlined, hollow, menu, icon]
 * @param {String} type - success or danger
 */
const Button = ({
  icon,
  text,
  size,
  onClick,
  variant,
  type = 'neutral',
  stretch,
  children,
  customClass,
  disabled
}) => {

  const [ open, setOpen ] = useState( false );

  let button_styles = styles.btn;
  // size cases
  switch ( size ) {
    case 'small':
      button_styles += ' ' + styles.small;
      break;
    case 'medium':
      button_styles += ' ' + styles.medium;
      break;
    case 'large':
      button_styles += ' ' + styles.large;
      break;
    case 'xl':
      button_styles += ' ' + styles.xl;
      break;
  }

  switch ( variant ) {
    case 'outlined':
      button_styles += ' ' + styles.outlined;
      break;
    case 'menu':
      button_styles += ' ' + styles.menu;
      break;
    case 'hollow':
      button_styles += ' ' + styles.hollow;
      break;
    case 'topic':
      button_styles += ' ' + styles.topic;
      break;
    case 'icon':
      button_styles += ' ' + styles.icon;
      break;
    case 'iconInverted':
      button_styles += ' ' + styles.icon_inverted;
      break;
  }

  if ( disabled ) {
    button_styles += ' ' + styles.disabled;
  }

  switch ( type ) {
    case 'success':
      button_styles += ' ' + styles.success;
      break;
    case 'danger':
      button_styles += ' ' + styles.danger;
      break;
  }

  //stretch case
  switch ( stretch ) {
    case 'medium':
      button_styles += ' ' + styles.stretch_medium;
      break;
    case 'wide':
      button_styles += ' ' + styles.stretch_wide;
      break;
    case false:
      break;
  }

  button_styles = customClass ?
    button_styles + ' ' + customClass :
    button_styles;

  const buttonRef = useRef( null );
  useClickAway( buttonRef, () => setOpen( false ) );

  return (
    <div ref={buttonRef} onClick={() => setOpen( true )}>
      <button className={button_styles} onClick={onClick} disabled={disabled}>
        {
          icon &&
          <div className={styles.icon_container}>{icon}</div>
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
  variant: PropTypes.string,
  text: PropTypes.string,
  size: PropTypes.string,
  icon: PropTypes.any
};

Button.defaultProps = {
  stretch: false,
  text: '',
  size: 'medium',
  variant: 'outlined'
};

export default Button;
