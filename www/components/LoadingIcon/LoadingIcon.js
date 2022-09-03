import styles from './LoadingIcon.module.css';

const LoadingIcon = ({ size }) => {
  switch ( size ) {
    case 'small':
      size = { width: '50px', height: '50px' };
      break;
    case 'medium':
      size = { width: '100px', height: '100px' };
      break;
    case 'large':
      size = { width: '150px', height: '150px' };
      break;

  }

  return (
    <div className={styles.container} style={size}>
      <div id="circle" className={styles.circleOuter}>
        <div id="hourHand" className={styles.hourHand}></div>
        <div id="minuteHand" className={styles.minuteHand}></div>
        <div className={styles.ticks}></div>
        <div
          className={styles.ticks}
          style={{ transform: 'rotate(30deg) translate(0, -850%)' }}
        ></div>
        <div
          className={styles.ticks}
          style={{ transform: 'rotate(30deg) translate(0, -850%)' }}
        ></div>
        <div
          className={styles.ticks}
          style={{ transform: 'rotate(60deg) translate(0, -850%)' }}
        ></div>
        <div
          className={styles.ticks}
          style={{ transform: 'rotate(90deg) translate(0, -850%)' }}
        ></div>
        <div
          className={styles.ticks}
          style={{ transform: 'rotate(120deg) translate(0, -850%)' }}
        ></div>
        <div
          className={styles.ticks}
          style={{ transform: 'rotate(150deg) translate(0, -850%)' }}
        ></div>
        <div
          className={styles.ticks}
          style={{ transform: 'rotate(180deg) translate(0, -850%)' }}
        ></div>
        <div
          className={styles.ticks}
          style={{ transform: 'rotate(210deg) translate(0, -850%)' }}
        ></div>
        <div
          className={styles.ticks}
          style={{ transform: 'rotate(240deg) translate(0, -850%)' }}
        ></div>
        <div
          className={styles.ticks}
          style={{ transform: 'rotate(270deg) translate(0, -850%)' }}
        ></div>
        <div
          className={styles.ticks}
          style={{ transform: 'rotate(300deg) translate(0, -850%)' }}
        ></div>
        <div
          className={styles.ticks}
          style={{ transform: 'rotate(330deg) translate(0, -850%)' }}
        ></div>
      </div>
    </div>
  );
};

export default LoadingIcon;
