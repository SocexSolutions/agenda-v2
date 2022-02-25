import styles from '../styles/Snackbar.module.css';

import { useEffect } from 'react';

/**
 * Snackbar used for displaying notifications to the user
 * @param {String} message - message to display
 * @param {String} type - type of message ['success' | 'danger']
 * @param {Boolean} open - if snackbar is open
 * @param {Number} timeout - how long till the snackbar closes
 * @param {Function} setOpen - set open
 */
const Snackbar = ( props ) => {
  let clNames = styles.snackbar;

  clNames = props.type ? clNames + ' ' + styles[ props.type ] : clNames;
  clNames = props.open ? clNames + ' ' + styles.open : clNames;

  useEffect( () => {
    const timeout = props.timeout || 3000;

    const startCloseTimer = async() => {
      return setTimeout( () => {
        props.setOpen( false );
      }, timeout );
    };

    if ( props.open ) {
      startCloseTimer();
    }
  }, [ props ] );

  return (
    <div className={clNames}>
      <p>{ props.message }</p>
    </div>
  );
};

export default Snackbar;
