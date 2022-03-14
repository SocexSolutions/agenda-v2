import { useSelector, useDispatch } from 'react-redux';

import { toggleDrawer } from '../store/features/drawer/drawerSlice';

import classNames from 'classNames';
import Link       from 'next/link';

import Button     from './Button';
import DropDown   from './DropDown';
import AgendaIcon from './AgendaIcon';

import MenuIcon                from '@material-ui/icons/Menu';
import HomeOutlinedIcon        from '@material-ui/icons/HomeOutlined';
import AddToPhotosOutlinedIcon from '@material-ui/icons/AddToPhotosOutlined';
import AccountCircleIcon       from '@material-ui/icons/AccountCircle';

import styles from '../styles/Nav.module.css';

const selectUser = state => state.user;

const Nav = () => {
  const dispatch = useDispatch();
  const user     = useSelector( selectUser );
  const userLink = `/user/${ user._id }`;

  if ( user.token === null ) {
    return (
      <>
        <nav className={styles.nav}>
          <Link href="/">
            <div className={styles.agenda}>
              <AgendaIcon />
              <h1>Agenda</h1>
            </div>
          </Link>

          <div className={styles.login}>
            <Link href="/login">
              <Button
                variant="outlined"
                text="Login"
                className={styles.navButton}
              />
            </Link>
            <Link href="/register">
              <Button
                variant="outlined"
                text="Sign Up"
                className={styles.navButton}
              />
            </Link>
          </div>
        </nav>
      </>
    );
  } else {
    return (
      <>
        <nav className={classNames( styles.nav, styles.navLoggedIn )}>
          <Button
            icon={<MenuIcon />}
            variant="icon"
            onClick={() => dispatch( toggleDrawer() )}
          />
          <Link href={userLink} passHref>
            <Button icon={<HomeOutlinedIcon />} variant="icon"/>
          </Link>
          <div className={styles.navCentered}>
            <Link href="/meeting/new" passHref>
              <Button
                icon={<AddToPhotosOutlinedIcon />}
                text="create"
                variant="outlined"
                hollow={true}
              />
            </Link>
          </div>
          <Button
            id="dropDownButton"
            text={user.username}
            icon={<AccountCircleIcon />}
            variant="icon"
            size="medium"
          >
            <DropDown />
          </ Button>
        </nav>
      </>
    );
  }
};

export default Nav;
