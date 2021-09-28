import React from "react";
import styles from "../styles/Notification.module.css";
import classNames from "classnames";
import PropTypes from "prop-types";
import { useState } from "react";

import CancelPresentationIcon from "@material-ui/icons/CancelPresentation";

const Notification = ({ message }) => {
  const [ close, setClose ] = useState( false );

  return (
    <div className={classNames( styles.container, close && styles.closePressed )}>
      <div onClick={() => setClose( !close )}><CancelPresentationIcon className={styles.close} /></div>
      <p>{message}</p>
      <div className={styles.loadingBar}></div>
    </div>
  );
};

Notification.propTypes = {
  message: PropTypes.string
};

Notification.defaultProps = {
  message: "Something went wrong"
};

export default Notification;