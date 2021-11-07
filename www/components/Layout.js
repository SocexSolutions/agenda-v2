
import styles from "../styles/Layout.module.css";
import Nav from "./Nav";
import Drawer from "./Drawer";
import { useSelector } from "react-redux"
import { useState } from "react";

const Layout = ({ children }) => {

  const [ drawerOpen, setDrawerOpen ] = useState( true );

  return (
    <>
      <Nav
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
      />
      <div className={styles.container}>
        <Drawer 
          drawerOpen={drawerOpen}
          setDrawerOpen={setDrawerOpen}
        />
        <main>
          {children}
        </main>
      </div>
    </>
  );
};

export default Layout;
