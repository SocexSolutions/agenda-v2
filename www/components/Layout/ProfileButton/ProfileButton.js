import {
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  IconButton
} from '@mui/material';
import { AccountCircle, Logout } from '@mui/icons-material';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { userLogout } from '../../../store/features/user';

export default function ProfileButton() {
  const [ anchor, setAnchor ] = useState( null );
  const dispatch = useDispatch();

  return (
    <>
      <IconButton
        size="large"
        onClick={( e ) => setAnchor( e.currentTarget )}
        color="white"
        disableFocusRipple
      >
        <AccountCircle />
      </IconButton>
      <Menu anchorEl={anchor} open={!!anchor} onClose={() => setAnchor( null )}>
        <MenuList dense>
          <MenuItem onClick={() => dispatch( userLogout() )}>
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText inset>Logout</ListItemText>
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  );
}
