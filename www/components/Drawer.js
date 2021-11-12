import styles from "../styles/Drawer.module.css";
import PropTypes from "prop-types";
import Button from "../components/Button";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIosTwoTone';


import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import CheckBoxOutlinedIcon from "@material-ui/icons/Checkboxoutlined";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";

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
        icon={<DoubleArrowIcon style={{ color: "var(--agendaPurple)" }} /> }
      />
      <Button
        text='Voting'
        size='large'
        stretch='wide'
        varient='menu'
        icon={<CheckBoxOutlinedIcon style={{ color: "var(--agendaGreen)" }} />}
      />
      <Button
        text='Completed'
        size='large'
        stretch='wide'
        varient='menu'
        icon={<CancelOutlinedIcon style={{ color: "var(--danger)" }} />}
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
