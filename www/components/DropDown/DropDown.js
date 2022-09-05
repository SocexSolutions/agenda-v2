import { Button } from '@mui/material';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon        from '@mui/icons-material/ExitToApp';

import { useDispatch } from 'react-redux';

import { userLogout } from '../../store/features/user';

import styles from './DropDown.module.scss';

const DropDown = () => {
  const dispatch = useDispatch();

  const logout = () => {
    dispatch( userLogout() );
  };

  return (
    <>
      <div className={styles.container}>
        <Button
          iconStart={<AccountCircleIcon />}
          className={styles.button}
          variant="text"
        >
          Profile
        </Button>
        <Button
          iconStart={<LogoutIcon />}
          onClick={() => logout()}
          variant="text"
          className={styles.button}
        >
          Log out
        </Button>
      </div>
    </>
  );
};

export default DropDown;
