import {
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  IconButton,
} from "@mui/material";
import { AccountCircle, Settings, Logout } from "@mui/icons-material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { userLogout } from "../../../store/features/user";
import AccountModal from "./AccountModal/AccountModal";

export default function ProfileButton() {
  const [anchor, setAnchor] = useState(null);
  const [openAccountModal, setOpenAccountModal] = useState(false);
  const dispatch = useDispatch();

  return (
    <>
      <IconButton
        size="large"
        onClick={(e) => setAnchor(e.currentTarget)}
        disableFocusRipple
      >
        <AccountCircle />
      </IconButton>
      <Menu anchorEl={anchor} open={!!anchor} onClose={() => setAnchor(null)}>
        <MenuList dense>
          <MenuItem onClick={() => setOpenAccountModal(true)}>
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText inset>Account</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => dispatch(userLogout())}>
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText inset>Logout</ListItemText>
          </MenuItem>
        </MenuList>
      </Menu>
      <AccountModal open={openAccountModal} setOpen={setOpenAccountModal} />
    </>
  );
}
