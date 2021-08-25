import Link from "next/link";
import styles from "../styles/Nav.module.css";
import Button from "./Button";

const Nav = () => {
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
