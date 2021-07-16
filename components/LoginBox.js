import Button from "./Button"
import styles from "../styles/Home.module.css";
import Link from 'next/link'

const LoginBox = () => {
  return (
    <div className={styles.loginContainer}>
      <h1 style={{ paddingBottom: "50px", fontFamily: "Roboto" }}>Agenda</h1>
      {/* <button className={styles.btn}>Login</button> */}
      <Button varient="primary" stretch={true} text="login" />
      <Button varient="secondary" stretch={true} text="Get Started" />
      <div style={{ paddingTop: "40px" }}>
        <Link href="./about">
          <a>About Us</a>
        </Link>
      </div>
    </div>
  );
};

export default LoginBox;
