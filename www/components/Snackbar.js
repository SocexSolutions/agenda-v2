import { useSelector } from 'react-redux';

import styles from '../styles/components/Snackbar.module.css';

/**
 * Snackbar used for displaying notifications to the user
 */
const Snackbar = () => {
  const type    = useSelector( state => state.snackbar.type );
  const message = useSelector( state => state.snackbar.message );
  const open    = useSelector( state => state.snackbar.open );

  let clNames = styles.snackbar;

  clNames = type ? clNames + ' ' + styles[ type ] : clNames;
  clNames = open ? clNames + ' ' + styles.open : clNames;

  return (
    <div className={clNames}>
      <p>{ message }</p>
    </div>
  );
};

export default Snackbar;
