import styles from "../styles/Drawer.module.css";
import PropTypes from "prop-types";
import {useState} from "react"
import Button from "../components/Button";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIosTwoTone';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIosTwoTone';
import CloseIcon from '@material-ui/icons/Close';
const Drawer = (drawerStatus) => {
  
  const [ open, setOpen ] = useState(true);
  const showDrawer = () => setOpen(!open);
  // console.log(open);



  return (
    <div className={styles.container}>
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
        <div className={styles.arrows} onClick={showDrawer}>
          <div className={open ? styles.arrow : styles.showOpenArrow} >
            <ArrowForwardIosIcon />
          </div>
          <div className={open ? styles.backArrow : styles.hideBackArrow} >
            <ArrowBackIosIcon />
          </div>
        </div>
    </div>
  );
};  

Drawer.propTypes = {
  drawerStatus: PropTypes.bool,
}

Drawer.defaultProps = {
  drawerStatus: true,
};

export default Drawer;
