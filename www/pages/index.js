import { Button } from "@mui/material";

import { useRouter } from "next/router";

import Link from "next/link";

import styles from "../styles/pages/index.module.scss";

const Home = () => {
  const router = useRouter();

  return (
    <>
      <div className={styles.home_container}>
        <div className={styles.title_container}>
          <div className={styles.title_left}>
            <h1>Meeting Minder</h1>
            <h3>A simple tool for better meetings.</h3>
          </div>
          <div className={styles.actions_container}>
            <Button
              onClick={() => router.push("/register")}
              variant="contained"
              text="Sign Up"
              size="large"
              className={styles.nav_button}
              disableElevation
            >
              Sign Up
            </Button>
            <p className={styles.login_link}>
              Already have an account?
              <Link href="login">Login</Link>
            </p>
          </div>
        </div>
        <div className={styles.previews}>
          <div className={styles.display_container}>
            <div className={styles.display_description}>
              <h2>
                <strong>Create</strong> Your Meeting
              </h2>
            </div>
            <div className={styles.display_item}>
              <div className={styles.display_1}></div>
            </div>
          </div>
          <div
            className={
              styles.display_container + " " + styles.display_container_reverse
            }
          >
            <div className={styles.display_item}>
              <div className={styles.display_2}></div>
            </div>
            <div className={styles.display_description}>
              <h2>
                <strong>Prioritize</strong> Your Topics
              </h2>
            </div>
          </div>
          <div className={styles.display_container}>
            <div className={styles.display_description}>
              <h2>
                Draw <strong>Meaningful</strong> Conclusions
              </h2>
            </div>
            <div className={styles.display_item}>
              <div className={styles.display_3}></div>
            </div>
          </div>
        </div>
        <div className={styles.cta}>
          <h1 className={styles.get_started}>Lets get started! 🚀</h1>
          <div className={styles.actions_container}>
            <Button
              onClick={() => router.push("/register")}
              variant="contained"
              text="Sign Up"
              size="large"
              className={styles.nav_button}
              disableElevation
            >
              Sign Up
            </Button>
            <p className={styles.login_link}>
              Already have an account?
              <Link href="login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
