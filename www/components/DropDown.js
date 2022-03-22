import styles from '../styles/DropDown.module.css';

import Button from '../components/Button';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import LogoutIcon from '@material-ui/icons/ExitToApp';
import ThemeIcon from '@material-ui/icons/ColorLens';

import { useRouter } from 'next/router';

import { pickTheme }  from '../store/features/theme/themeSlice';
import { userLogout } from '../store/features/user/userSlice';

import { useSelector, useDispatch } from 'react-redux';

const selectUser = ( state ) => state.user;

const DropDown = () => {
  const dispatch = useDispatch();
  const router   = useRouter();
  const user     = useSelector( selectUser );
  const user_id  = user._id || '';

  const themeSwitch = async() => {
    await dispatch( pickTheme('dark') );
  };

  const logout = () => {
    dispatch( userLogout() );
    router.push('/');
  };

  return (
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
        onClick={() => themeSwitch()}
      />
    </div>
  );
};

export default DropDown;
