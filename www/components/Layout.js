
import styles from "../styles/Layout.module.css";

import Nav from "./Nav";
import Drawer from "./Drawer";
import {useSelector} from "react-redux"
const Layout = ({ children }) => {

  return (
    <>
      <Nav />
      <div className={styles.container}>
        <Drawer />
        <main>
          {children}
        </main>
      </div>
    </>
  );
};

export default Layout;
