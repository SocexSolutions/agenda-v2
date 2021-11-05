import styles from "../styles/Drawer.module.css";
import PropTypes from "prop-types";
import {useState} from "react"
import Button from "../components/Button";

const Drawer = () => {
  const [ open, setOpen ] = useState( false );
  const showDrawer = () => setOpen(!open);
  console.log(open);
  return (
    <div className={styles.container} onClick={showDrawer}>
      <div className={open ? styles.drawerContainer : styles.drawerClosed}>
        <h2>Socnet</h2>
        <div className={styles.hr}></div>
        <Button
          text='Upcoming'
          size='large'
          stretch='wide'
          varient='menu'
          icon='doubleArrow'
          />
        <Button
          text='Voting'
          size='large'
          stretch='wide'
          varient='menu'
          icon='checkBox'
          />
        <Button
          text='Completed'
          size='large'
          stretch='wide'
          varient='menu'
          icon='cancel'
          />
      </div>
    </div>
  );
};  

Drawer.propTypes = {
  open: PropTypes.bool,
}

Drawer.defaultProps = {
  open: PropTypes.bool,
  onCLick: PropTypes.func,
};

export default Drawer;
