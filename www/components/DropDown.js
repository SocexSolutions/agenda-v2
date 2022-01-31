import styles from '../styles/DropDown.module.css';
import Button from '../components/Button';

import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SettingsIcon from '@material-ui/icons/Settings';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import LogoutIcon from '@material-ui/icons/ExitToApp';

import { useStore } from '../store/store';
import { userLogout } from '../store/features/user/userSlice';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

const selectUser = ( state ) => state.user;


const DropDown = () => {
  const store = useStore({});

  const logout = () => {
    store.dispatch(
      userLogout()
    );
  };

  const user = useSelector( selectUser );
  const user_id = user._id || '';

  return (
    <div className={styles.container}>
      <Button icon={<AccountCircleIcon />} varient="menu" stretch="wide" text="Profile" onClick={() => window.location = `/user/${ user_id }`}/>
      <Button icon={<AccountTreeIcon />} varient="menu" stretch="wide" text="Account" />
      <Button icon={<SettingsIcon />} varient="menu" stretch="wide" text="Settings" />
      <Button icon={<HelpOutlineIcon />} varient="menu" stretch="wide" text="Help" />
      <Button icon={<LogoutIcon />} varient="menu" stretch="wide" text="Logout" onClick={() => logout()}/>
    </div>
  );
};


export default DropDown;
