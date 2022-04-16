import styles from '../styles/Notification.module.css';
import classNames from 'classnames';

import { useState } from 'react';

import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';

const Notification = ({ message, error }) => {
  const [ close, setClose ] = useState( false );

  if ( error === true ) {
    error = 'Error:';
  } else {
    error === 'Success:';
  }

  return (
    <div
      className={classNames( styles.container, close && styles.closePressed )}
    >
      <div
        onClick={() =>
          setClose( !close )}><CancelPresentationIcon className={styles.close}
        />
      </div>
      <h1>{error}</h1>
      <p>{message}</p>
      <div className={styles.loadingBar}></div>
    </div>
  );
};

export default Notification;
