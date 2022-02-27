import styles from '../styles/DropDown.module.css';

import Button from '../components/Button';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import LogoutIcon from '@material-ui/icons/ExitToApp';

import { userLogout } from '../store/features/user/userSlice';

import { useSelector, useDispatch } from 'react-redux';

const selectUser = ( state ) => state.user;

const DropDown = () => {
  const dispatch = useDispatch();
  const user     = useSelector( selectUser );
  const user_id  = user._id || '';

  const logout = () => {
    dispatch( userLogout() );
  };

  return (
    <div className={styles.container}>
      <Button
        icon={<AccountCircleIcon />}
        varient="menu"
        stretch="wide"
        text="Profile"
        onClick={() => ( window.location = `/user/${ user_id }` )}
      />
      <Button
        icon={<LogoutIcon />}
        varient="menu"
        stretch="wide"
        text="Logout"
        onClick={() => logout()}
      />
    </div>
  );
};

export default DropDown;
