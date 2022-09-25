import SideBarButton from './SideBarButton/SideBarButton';

import { Fade } from '@mui/material';

import styles from './SideBar.module.scss';

export default function SideBar({ topics, meetingName, switchToTopic }) {
  return (
    <Fade in={!!topics && !!meetingName}>
      <div className={styles.side_bar}>
        <h3>{meetingName}</h3>
        <div className={styles.button_container}>
          {topics.map( ( topic ) => {
            return (
              <SideBarButton
                topic={topic}
                onClick={() => switchToTopic( topic._id )}
                key={topic.name}
                name={topic.name}
              />
            );
          })}
        </div>
      </div>
    </Fade>
  );
}