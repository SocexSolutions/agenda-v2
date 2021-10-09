import { useState } from "react";

import styles from "../styles/Layout.module.css";

import Nav from "./Nav";
import Drawer from "./Drawer";

const Layout = ({ children }) => {
  const [ open, setOpen ] = useState( true );

  let drawer = styles.drawerContainer;

  if ( !open ) {
    drawer = drawer + " " + styles.drawerClosed;
  }

  return (
    <>
      <Nav />
      <div className={styles.container}>
        <main
          //onClick={ () => setOpen( !open ) }
        >
          {children}
        </main>
      </div>
    </>
  );
};

export default Layout;
