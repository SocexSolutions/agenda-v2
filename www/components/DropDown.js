import styles from "../styles/DropDown.module.css";
import Button from "../components/Button";

const DropDown = () => {
  return (
    <div className={styles.container}>
      <Button icon="person" varient="menu" stretch="wide" text="Profile" />
      <Button icon="account" varient="menu" stretch="wide" text="Account" />
      <Button icon="settings" varient="menu" stretch="wide" text="Settings" />
      <Button icon="help" varient="menu" stretch="wide" text="Help" />
      <Button icon="logout" varient="menu" stretch="wide" text="Logout" />
    </div>
  );
};


export default DropDown;