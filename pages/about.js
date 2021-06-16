import Head from "next/head";
import Header from "../components/Header";
import styles from "../styles/Home.module.css";

const About = () => {
  return (
    <>
      <Header headerText="About Us" />
      <div className={styles.aboutUsContainer}>
        <h1>What is Agenda?</h1>
        <p>
          Agenda will allow for more efficient meetings by estabilshing meeting
          topics in advance, establishing each topics value, and then deciding
          on the order and allocating time to the topics based on their value.
          In addition, agenda will simplify meeting notes avoiding TLDR through
          action items for each topic.
        </p>
        <h1>Our Mission Statement</h1>
        <p>
          To revolutionize team collaboration by turning the tradition meeting
          from a waste of time to a fun productive activity.
        </p>
      </div>
    </>
  );
};

export default About;
