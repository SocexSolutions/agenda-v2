import styles from '../styles/ThemeCard.module.css';
import Image from 'next/image';

import { pickTheme }  from '../store/features/theme';

import { useStore } from 'react-redux';

const ThemeCard = ( props ) => {
  const store = useStore();


  const themeSwitch = async( theme ) => {
    await store.dispatch( pickTheme( theme ) );
  };

  return (
    <div className={styles.container} onClick={() => themeSwitch( props.theme )}>
      <div  className={styles.imageContainer}>
        <Image
          src={props.image}
          alt="Picture of the author"
          layout='fill'
        />
      </div>
      <h3>{props.header}</h3>
    </div>
  );
};

export default ThemeCard;
