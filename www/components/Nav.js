import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Button from "./Button";
import { userRegister } from "../store/features/user/userSlice";
import styles from "../styles/Nav.module.css";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import PersonIcon from "@material-ui/icons/Person";

// this should probably go somewhere else so we can reuse it
const selectUser = (state) => state.user;

const Nav = () => {
  const user = useSelector(selectUser);
  console.log(user);

  if (user.token === null) {
    return (
      <>
        <nav className={styles.nav}>
          <div className={styles.Agenda}>
            <Link href="/">Agenda</Link>
          </div>
          <div className={styles.login}>
            <Link href="/login">
              <Button varient="secondary" text="Login" />
            </Link>
            <Link href="/register">
              <Button text="Sign Up" />
            </Link>
          </div>
        </nav>
      </>
    );
  } else {
    return (
      <>
        <nav className={styles.nav}>
          <Link href="/" passHref>
            <Button icon="home" varient="icon" />
          </Link>

          <div className={styles.navcentered}>
            <Link href="/messageExample" passHref>
              <Button icon="addicon" text="create" varient="secondary" />
            </Link>
          </div>
          <Button icon="person" varient="icon" size="small" />
        </nav>
      </>
    );
  }
};
export default Nav;
