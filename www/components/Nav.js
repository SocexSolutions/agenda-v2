import { useSelector, useDispatch } from 'react-redux';

import { toggleDrawer } from '../store/features/drawer/drawerSlice';

import classNames from 'classNames';
import Link       from 'next/link';
import { useRouter }     from 'next/router';

import Button     from './Button';
import DropDown   from './DropDown';
import AgendaIcon from './AgendaIcon';

import MenuIcon                from '@mui/icons-material/Menu';
import HomeOutlinedIcon        from '@mui/icons-material/HomeOutlined';
import AddToPhotosOutlinedIcon from '@mui/icons-material/AddToPhotosOutlined';
import AccountCircleIcon       from '@mui/icons-material/AccountCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import styles from '../styles/Nav.module.css';
import { useEffect, useState } from 'react';


const selectUser = state => state.user;
const Nav = () => {
  const router = useRouter();

  const [ history, setHistory ]               = useState([]);
  const [ whereInHistory, setWhereInHistory ] = useState( -1 );
  const [ backPressed, setBackPressed ]       = useState( false );
  const [ forwardPressed, setForwardPressed ] = useState( false );

  const dispatch = useDispatch();
  const user     = useSelector( selectUser );

  const homeHref = user && user._id ? `/user/${ user._id }` : `/login`;

  useEffect( () => {
    // match browser behavior of removing history when user is within their
    // history and move to a new page breaking their timeline
    const clearForwardHistory = () => {
      const tempArr = history;

      tempArr.splice(
        whereInHistory + 1,
        tempArr.length - whereInHistory - 1,
        router.asPath
      );

      setHistory( tempArr );
      setWhereInHistory( tempArr.length - 1 );
    };

    const handleHistoryWhenButtonsNotPressed = () => {
      if ( whereInHistory < history.length - 1 ) {
        clearForwardHistory();
      } else {
        setHistory( arr => [ ...arr, router.asPath ] );
        setWhereInHistory( whereInHistory + 1 );
      }
    };

    if ( !backPressed && !forwardPressed ) {
      handleHistoryWhenButtonsNotPressed();
    }

    if ( forwardPressed ) {
      setForwardPressed( false );
      setWhereInHistory( whereInHistory + 1 );
    }

    if ( backPressed ) {
      setBackPressed( false );
      setWhereInHistory( whereInHistory - 1 );
    }
  }, [ router ] );

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
                customClass={styles.nav_button}
              />
            </Link>
            <Link href="/register">
              <Button
                variant="outlined"
                text="Sign Up"
                customClass={styles.nav_button}
              />
            </Link>
          </div>
        </nav>
      </>
    );
  } else {
    return (
      <>
        <nav className={classNames( styles.nav, styles.nav_logged_in )}>
          <div className={styles.first_third}>
            <Button
              icon={<MenuIcon />}
              variant="icon"
              onClick={() => dispatch( toggleDrawer() )}
            />
            <Link href={homeHref} passHref>
              <Button icon={<HomeOutlinedIcon />} variant="icon"/>
            </Link>
            <Button
              disabled={ whereInHistory < 1 }
              icon={<ArrowBackIcon />}
              variant="icon"
              onClick={() => {
                setBackPressed( true );
                router.push( history[ whereInHistory - 1 ] );
              }}
            />
            <Button
              disabled={ whereInHistory >= history.length - 1 }
              icon={<ArrowForwardIcon />}
              variant="icon"
              onClick={() => {
                setForwardPressed( true );
                router.push( history[ whereInHistory + 1 ] );
              }}
            />
          </div>
          <div className={styles.center_third}>
            <Link href="/meeting/new" passHref>
              <Button
                icon={<AddToPhotosOutlinedIcon />}
                text="create"
                variant="outlined"
                hollow={true}
              />
            </Link>
          </div>
          <div className={styles.last_third}>
            <Button
              id="dropDownButton"
              text={user.username}
              icon={<AccountCircleIcon />}
              variant="icon"
              size="medium"
            >
              <DropDown />
            </ Button>
          </div>
        </nav>
      </>
    );
  }
};

export default Nav;
