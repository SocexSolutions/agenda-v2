import Button    from '../Button/Button';
import Modal     from '../Modal/Modal';
import ThemeCard from '../ThemeCard/ThemeCard';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon        from '@mui/icons-material/ExitToApp';
import ThemeIcon         from '@mui/icons-material/ColorLens';

import placeholder from '../../public/placeholderTheme.png';

import { useRouter } from 'next/router';
import { useState }  from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { userLogout } from '../../store/features/user';

import styles from './DropDown.module.css';

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
          icon={<ThemeIcon />}
          variant="menu"
          text="Theme"
          onClick={() => setShowThemes( true )}
        />
        <Button
          icon={<LogoutIcon />}
          variant="menu"
          text="Logout"
          onClick={() => logout()}
        />
      </div>
      <div>
        { showThemes && <Modal closeListener={closeThemes}>
          <ThemeCard header="Default" image={placeholder} theme='default'/>
          <ThemeCard header="Dark" image={placeholder} theme='dark'/>
          <ThemeCard header="Light" image={placeholder} theme='light'/>
          <ThemeCard header="Zachs Theme" image={placeholder} theme='zachsTheme'/>
          <ThemeCard header="Agenda OG" image={placeholder} theme='agendaOG' />
          <ThemeCard header="Banana" image={placeholder} theme='banana'/>
        </Modal>}
      </div>
    </>
  );
};

export default DropDown;
