import { useState } from "react";

import styles from "../styles/Layout.module.css";

import Nav from "./Nav";
import Drawer from "./Drawer";

const Layout = ({ children }) => {

  const [ open, setOpen ] = useState( true );

  if( open ) {
    switch( children.type.name ) {
    case "Meeting":
      setOpen( !open );
      break;
    case "Inbox":
      setOpen( !open );
      break;
    }
  }

  let drawer = styles.drawerContainer;

  if ( open ) {
    drawer = drawer + " " + styles.drawerClosed;
  }

  return (
    <>
      <Nav />
      <div className={styles.container}>
        <div className={drawer}>
          <Drawer />
        </div>
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
