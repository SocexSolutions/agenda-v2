import styles from "../styles/Drawer.module.css";

import Button from "../components/Button";

const Drawer = () => {
  return (
    <div className={styles.container}>
      <h2>Socnet</h2>
      <div className={styles.hr}></div>
      <Button
        text='Upcoming'
        size='large'
        stretch='wide'
        varient='menu'
        icon='doubleArrow'
      />
      <Button
        text='Voting'
        size='large'
        stretch='wide'
        varient='menu'
        icon='checkBox'
      />
      <Button
        text='Completed'
        size='large'
        stretch='wide'
        varient='menu'
        icon='cancel'
      />
    </div>
  );
};

export default Drawer;
