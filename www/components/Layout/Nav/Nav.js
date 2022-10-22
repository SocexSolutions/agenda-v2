import { toggleDrawer } from "../../../store/features/drawer";
import ProfileButton from "../ProfileButton/ProfileButton";
import { IconButton, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./Nav.module.scss";

const selectUser = (state) => state.user;

const Nav = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const [history, setHistory] = useState([]);
  const [whereInHistory, setWhereInHistory] = useState(-1);
  const [backPressed, setBackPressed] = useState(false);
  const [forwardPressed, setForwardPressed] = useState(false);

  const homeHref = user && user._id ? `/user/${user._id}/home` : `/login`;

  useEffect(() => {
    // match browser behavior of removing history when user is within their
    // history and move to a new page breaking their timeline
    const clearForwardHistory = () => {
      const tempArr = history;

      tempArr.splice(
        whereInHistory + 1,
        tempArr.length - whereInHistory - 1,
        router.asPath
      );

      setHistory(tempArr);
      setWhereInHistory(tempArr.length - 1);
    };

    const handleHistoryWhenButtonsNotPressed = () => {
      if (whereInHistory < history.length - 1) {
        clearForwardHistory();
      } else {
        setHistory((arr) => [...arr, router.asPath]);
        setWhereInHistory(whereInHistory + 1);
      }
    };

    if (!backPressed && !forwardPressed) {
      handleHistoryWhenButtonsNotPressed();
    }

    if (forwardPressed) {
      setForwardPressed(false);
      setWhereInHistory(whereInHistory + 1);
    }

    if (backPressed) {
      setBackPressed(false);
      setWhereInHistory(whereInHistory - 1);
    }
  }, [router]);

  if (!user.token) {
    return (
      <>
        <nav className={styles.nav}>
          <Link href="/">
            <div className={styles.agenda}>
              <img src="./logo.png" alt="Agenda" className={styles.logo} />
            </div>
          </Link>
          <div className={styles.login}>
            <Button
              onClick={() => router.push("/login")}
              color="blue"
              variant="text"
              text="Login"
              className={styles.nav_button}
              disableElevation
            >
              Login
            </Button>
            <Button
              onClick={() => router.push("/register")}
              variant="contained"
              text="Sign Up"
              className={styles.nav_button}
              disableElevation
            >
              Sign Up
            </Button>
          </div>
        </nav>
      </>
    );
  } else {
    return (
      <>
        <nav className={styles.nav + " " + styles.nav_logged_in}>
          <div className={styles.start}>
            <IconButton onClick={() => dispatch(toggleDrawer())}>
              <MenuIcon />
            </IconButton>
            <IconButton onClick={() => router.push(homeHref)}>
              <HomeOutlinedIcon />
            </IconButton>
            <IconButton
              disabled={whereInHistory < 1}
              onClick={() => {
                setBackPressed(true);
                router.push(history[whereInHistory - 1]);
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <IconButton
              disabled={whereInHistory >= history.length - 1}
              onClick={() => {
                setForwardPressed(true);
                router.push(history[whereInHistory + 1]);
              }}
            >
              <ArrowForwardIcon />
            </IconButton>
          </div>
          <div className={styles.end}>
            <ProfileButton />
          </div>
        </nav>
      </>
    );
  }
};

export default Nav;
