import Head from "next/head";
import Link from 'next/link'
import Header from "../components/Header";
import LoginBox from "../components/LoginBox"
import Button from "../components/Button";
import LoginForm from "../components/LoginForm"
import styles from "../styles/Home.module.css";

const Home = () => {
  return (
    <>
      <Header headerText='Welcome to Agenda' />
      <title>Agenda</title>
      <LoginBox />
    </>
  );
};

export default Home;
