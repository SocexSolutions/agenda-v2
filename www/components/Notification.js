import React from "react";
import styles from "../styles/Notification.module.css";
import classNames from "classnames";
import PropTypes from "prop-types";
import { useState } from "react";

import CancelPresentationIcon from "@material-ui/icons/CancelPresentation";

const Notification = ({ message, error }) => {
  const [ close, setClose ] = useState( false );

  if( error == true ) {
    error = "Error:";
  }
  else {
    error == "Success:";
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

Notification.propTypes = {
  message: PropTypes.string,
  error: PropTypes.bool
};

Notification.defaultProps = {
  message: "Something went wrong",
  error: true
};

export default Notification;