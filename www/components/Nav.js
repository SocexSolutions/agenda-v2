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
  const userLink = `/user/${ user._id }`;

  useEffect( () => {
    const clearForwardHistory = () => {
      console.log('clearForwardHistory');
      const tempArr = history;
      tempArr.splice(
        whereInHistory + 1,
        tempArr.length - whereInHistory - 1,
        router.pathname
      );

      setHistory( tempArr );
      setWhereInHistory( tempArr.length - 1 );
    };

    const handleHistoryWhenButtonsNotPressed = () => {
      console.log('handleHistoryWhenButtonsNotPressed');
      let theRoute = router.pathname;


      if ( router.query !== {} ) {
        for ( const [ key, value ] of Object.entries( router.query ) ) {
          theRoute = theRoute.replace( `[${ key }]`, value );
        }
      }

      if ( whereInHistory < history.length - 1 ) {
        clearForwardHistory();
      } else {
        setHistory( arr => [ ...arr, theRoute ] );
        setWhereInHistory( whereInHistory + 1 );
      }
    };

    if ( !backPressed ) {
      if ( !forwardPressed ) {
        handleHistoryWhenButtonsNotPressed();

      } else {
        setForwardPressed( false );
        setWhereInHistory( whereInHistory + 1 );
      }
    } else {
      setBackPressed( false );
      setWhereInHistory( whereInHistory - 1 );
    }
  }, [ router.pathname ] );

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
          {whereInHistory > 0 &&
            <Button
              icon={<ArrowBackIcon />}
              variant="icon"
              onClick={() => {
                setBackPressed( true );
                router.push( history[ whereInHistory - 1 ] );
              }}
            />}
          { whereInHistory < history.length - 1 &&
            <Button
              icon={<ArrowForwardIcon />}
              variant="icon"
              onClick={() => {
                setForwardPressed( true );
                router.push( history[ whereInHistory + 1 ] );
              }}
            />}
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
