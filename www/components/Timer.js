import styles from '../styles/Timer.module.css'

const Timer = (duration, size) => {
  return (
  <div className={styles.timer} style={{ duration: { duration }, size: { size } }}>
    <div className={styles.mask}></div>
  </div>
  )
}

export default Timer;
