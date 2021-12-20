import styles from "../styles/DropDown.module.css";
import Button from "../components/Button";

import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import SettingsIcon from "@material-ui/icons/Settings";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import LogoutIcon from "@material-ui/icons/ExitToApp";


const DropDown = () => {
  return (
    <div className={styles.container}>
      <Button icon={<AccountCircleIcon />} varient="menu" stretch="wide" text="Profile" />
      <Button icon={<AccountTreeIcon />} varient="menu" stretch="wide" text="Account" />
      <Button icon={<SettingsIcon />} varient="menu" stretch="wide" text="Settings" />
      <Button icon={<HelpOutlineIcon />} varient="menu" stretch="wide" text="Help" />
      <Button icon={<LogoutIcon />} varient="menu" stretch="wide" text="Logout" />
    </div>
  );
};


export default DropDown;