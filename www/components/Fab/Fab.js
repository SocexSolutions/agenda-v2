import styles from './Fab.module.scss';
import Button from '@mui/material/Button';

export default function Fab({ children, ...props }) {
  return (
    <Button className={styles.fab} {...props}>
      {children}
    </Button>
  );
}
