import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Button from "./Button";
import { userRegister } from "../store/features/user/userSlice";
import styles from "../styles/Nav.module.css";
import AgendaIcon from "./AgendaIcon";

// this should probably go somewhere else so we can reuse it
const selectUser = ( state ) => state.user;

const Nav = () => {
  const user = useSelector( selectUser );
  console.log( user );

  if ( user.token === null ) {
    return (
      <>
        <nav className={styles.nav}>
          <Link href="/">
            <div className={styles.Agenda}>
              <AgendaIcon />
              <h1>Agenda</h1>
            </div>
          </Link>

          <div className={styles.login}>
            <Link href="/login">
              <Button varient="secondary" text="Login" />
            </Link>
            <Link href="/register">
              <Button varient="secondary" text="Sign Up" />
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
              <Button icon="addicon"
                text="create" varient="secondary" />
            </Link>
          </div>
          <Link href={`/User/${user._id}`} passHref>
            <Button text={user.username}
              icon="person"
              varient="icon"
              size="small" />
          </Link>
        </nav>
      </>
    );
  }
};
export default Nav;
