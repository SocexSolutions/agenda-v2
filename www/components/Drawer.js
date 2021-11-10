import styles from "../styles/Drawer.module.css";
import PropTypes from "prop-types";
import {useState} from "react"
import Button from "../components/Button";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIosTwoTone';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIosTwoTone';
import CloseIcon from '@material-ui/icons/Close';


const Drawer = ({ drawerOpen, setDrawerOpen }) => {

  return (
    <div 
      className={`${ styles.container } ${ !drawerOpen && styles.closed }`}
    >
      <h2>Socnet</h2>
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
      <div 
        className={styles.arrow} 
        onClick={() => setDrawerOpen(!drawerOpen)}
      >
        <div 
          className={drawerOpen ? styles.arrowClose : styles.arrowOpen} 
        >
          <ArrowForwardIosIcon />
        </div>
      </div>
    </div>
  );
};  

Drawer.propTypes = {
  drawerStatus: PropTypes.bool,
  setDrawerOpen: PropTypes.func,
}

Drawer.defaultProps = {
  drawerOpen: true,
  // setDrawerOpen: 
};

export default Drawer;
