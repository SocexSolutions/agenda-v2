import { useSelector } from "react-redux";
import React, {  useState } from "react";
import PropTypes from "prop-types";

import Link from "next/link";
import Button from "./Button";
import AgendaIcon from "./AgendaIcon";
import DropDown from "../components/DropDown"

import styles from "../styles/Nav.module.css";
// this should probably go somewhere else so we can reuse it
const selectUser = ( state ) => state.user;

const Nav = ( props ) => {
  const user = useSelector( selectUser );
  console.log( user );

  if ( user.token === null ) {
    return (
      <>
        <nav className={styles.nav}>
          <Link href="/">
            <div className={styles.Agenda}>
              <AgendaIcon />
              <h1>Agenda</h1>
            </div>
          </Link>

          <div className={styles.login}>
            <Link href="/login">
              <Button varient="secondary" text="Login"/>
            </Link>
            <Link href="/register">
              <Button varient="secondary" text="Sign Up" />
            </Link>
          </div>
        </nav>
      </>
    );
  } else {
    return (
      <>
        <nav className={styles.navLoggedIn}>
          <Link href="/" passHref>
            <Button icon="home" varient="icon"/>
          </Link>

          <div className={styles.navcentered}>
            <Link href="/messageExample" passHref>
              <Button icon="addicon"
                text="create" varient="secondary" />
            </Link>
          </div>
          <Button text={user.username}
            icon="person"
            varient="icon"
            size="medium"
            onClick="dropDown"
          >
            <DropDown />
          </Button>
        </nav>
      </>
    );
  }
};
export default Nav;
