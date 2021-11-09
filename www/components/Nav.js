import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import Link from "next/link";
import Button from "./Button";
import styles from "../styles/Nav.module.css";
import AgendaIcon from "./AgendaIcon";

const selectUser = ( state ) => state.user;

const Nav = ({ drawerOpen, setDrawerOpen }) => {

  const user = useSelector( selectUser );

  if ( user.token === null ) {
    return (
      <>
        <nav className={styles.nav}>
          <Link href="/">
            <div className={styles.Agenda}>
              <AgendaIcon />
              <h1>Agenda</h1>
            </div>
          </Link>

          <div className={styles.login}>
            <Link href="/login">
              <Button varient="secondary" text="Login"/>
            </Link>
            <Link href="/register">
              <Button varient="secondary" text="Sign Up" />
            </Link>
          </div>
        </nav>
      </>
    );
  } else {
    return (
      <>
        <nav className={styles.navLoggedIn}>
          <Button 
            icon="drawer" 
            varient="icon" 
            onClick={() => setDrawerOpen(!drawerOpen)}
          />
          <Link href="/" passHref>
            <Button icon="home" varient="icon"/>
          </Link>

          <div className={styles.navcentered}>
            <Link href="/meeting" passHref>
              <Button 
                icon="addicon"
                text="create" 
                varient="secondary" 
              />
            </Link>
          </div>

          <Link href={`/user/${user._id}`} passHref>
            <Button 
              text={user.username}
              icon="person"
              varient="icon"
              size="small"
            />
          </Link>
        </nav>
      </>
    );
  }
};

Nav.propTypes = {
  drawerOpen: PropTypes.bool,
  setDrawerOpen: PropTypes.func
}

Nav.defaultProps = {
  drawerOpen: true,
  // setDrawerOpen: 
};

export default Nav;
