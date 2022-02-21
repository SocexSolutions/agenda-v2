import styles from '../styles/Home.module.css';
import Button from '../components/Button';
import { useState } from 'react';
import SnackBar from '@material-ui/core/Snackbar'

const Home = () => {
  const [ open, setOpen ] = useState( false );

  return (
    <>
      <div className={styles.homeContainer}>
        <h1>Meet with a purpose.</h1>
        <p>
          The Finder is the default file manager and graphical user interface
          shell used on all Macintosh operating systems. Described in its
          "About" window as "The Macintosh Desktop Experience", it is
          responsible for the launching of other applications, and for the
          overall user management of files, disks, and network volumes.
        </p>
      </div>
      <Button text="click for a snackbar" onClick={() => setOpen( !open )}/>
      <SnackBar open={open} onClose={() => setOpen( !open )} text="tom hudson sent you a new meeting" />
    </>
  );
};

export default Home;
