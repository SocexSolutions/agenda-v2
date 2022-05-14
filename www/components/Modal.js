import styles from '../styles/Modal.module.css';

const Modal = ( props ) => {
  return (
    <div className={styles.blurBackground} onClick={( e ) => props.closeListener( e )}>
      <div className={styles.container}>
        {props.children}
      </div>
    </div>
  );
};

export default Modal;
