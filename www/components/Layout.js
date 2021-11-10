import styles from "../styles/Layout.module.css";
import Nav from "./Nav";
import Drawer from "./Drawer";
import { useState } from "react";

const pagesWithoutDrawer = new Set( [
  "home",
  "Login",
  "Register"
] );

const Layout = ({ children }) => {

  const [ drawerOpen, setDrawerOpen ] = useState( true );

  const showDrawer = !pagesWithoutDrawer.has( children.type.name );

  return (
    <>
      <Nav
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
      />
      <div className={styles.container}>
        { showDrawer &&
          <Drawer
            drawerOpen={drawerOpen}
            setDrawerOpen={setDrawerOpen}
          />
        }
        <main>
          {children}
        </main>
      </div>
    </>
  );
};

export default Layout;
