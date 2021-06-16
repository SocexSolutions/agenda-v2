import Head from "next/head";
import Header from "../components/Header";
import styles from "../styles/Home.module.css";

const Home = () => {
  return (
    <>
      <Header headerText='Welcome to Agenda' />
      <title>Agenda</title>
      <div className={styles.loginContainer}>
        <h1 style={{ paddingBottom: "50px", fontFamily: "Roboto" }}>
          Agenda
        </h1>
        <button className={styles.btn}>Login</button>
        <button
          style={{ backgroundColor: "rgb(132, 153, 137)" }}
          className={styles.btn}
        >
          Get Started
        </button>
        <div style={{ paddingTop: "40px" }}>
          <a href="./about">About us</a>
        </div>
      </div>
    </>
  );
};

export default Home;
