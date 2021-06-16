import styles from "../styles/Home.module.css";

const Header = ({ headerText }) => {
  return (
    <div className={styles.header}>
      <h1 className={styles.headerContent}>{headerText}</h1>
    </div>
  );
};

export default Header