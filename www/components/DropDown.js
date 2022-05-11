import styles from '../styles/DropDown.module.css';

import Button from '../components/Button';
import Modal from '../components/Modal';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon        from '@mui/icons-material/ExitToApp';
import ThemeIcon         from '@mui/icons-material/ColorLens';
import placeholder from '../public/placeholderTheme.png';
import ThemeCard from './ThemeCard';

import { useRouter } from 'next/router';

import { useState } from 'react';
import { userLogout } from '../store/features/user/userSlice';

import { useSelector, useDispatch } from 'react-redux';

const selectUser = ( state ) => state.user;

const DropDown = () => {
  const dispatch = useDispatch();
  const router   = useRouter();
  const user     = useSelector( selectUser );
  const user_id  = user._id || '';
  const [ showThemes, setShowThemes ] = useState( false );

  const closeThemes = ( e ) => {
    if ( e.target !== e.currentTarget ) { return; }
    setShowThemes( false );
  };

  const logout = () => {
    dispatch( userLogout() );
  };

  return (
    <>
      <div className={styles.container}>
        <Button
          icon={<AccountCircleIcon />}
          variant="menu"
          text="Profile"
          onClick={() => router.push( `/user/${ user_id }` ) }
        />
        <Button
          icon={<LogoutIcon />}
          variant="menu"
          text="Logout"
          onClick={() => logout()}
        />
        <Button
          icon={<ThemeIcon />}
          variant="menu"
          text="Theme"
          onClick={() => setShowThemes( true )}
        />
      </div>
      <div>
        { showThemes && <Modal closeListener={closeThemes}>
          <ThemeCard header="Default" image={placeholder} theme='default'/>
          <ThemeCard header="Dark" image={placeholder} theme='dark'/>
          <ThemeCard header="Zachs Theme" image={placeholder} theme='zachsTheme'/>
          <ThemeCard header="Agenda OG" image={placeholder} theme='agendaOG' />
          <ThemeCard header="Banana" image={placeholder} theme='banana'/>
        </Modal>}
      </div>
    </>
  );
};

export default DropDown;
