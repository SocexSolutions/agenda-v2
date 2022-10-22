import styles from "./IconTextField.module.scss";

import { TextField } from "@mui/material";
import { IconButton } from "@mui/material";

const IconTextField = ({ Icon, onIconClick, className, ...other }) => {
  const combinedClassName = `${styles.container} ${className}`;

  return (
    <div className={combinedClassName}>
      <TextField className={styles.input} {...other} />
      <IconButton
        className={styles.icon_button}
        onClick={onIconClick}
        size={other.size}
      >
        <Icon />
      </IconButton>
    </div>
  );
};

export default IconTextField;
