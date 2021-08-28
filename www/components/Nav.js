import Link from "next/link";
import styles from "../styles/Nav.module.css";
import Button from "./Button";
import { useDispatch, useSelector } from 'react-redux';


// this should probably go somewhere else so we can reuse it
const selectUser = state => state.user;

const Nav = () => {
  const user = useSelector( selectUser );

  console.log( user );

  return (
    <>
      <nav className={styles.nav}>
        <ul className={styles.Agenda}>
          <li>
            <Link href="/">Agenda</Link>
          </li>
        </ul>
        <div className={styles.login}>
          <Button varient="secondary" text="Login" />
          <Button text="Sign Up" />
        </div>
      </nav>
    </>
  );
};

export default Nav;
