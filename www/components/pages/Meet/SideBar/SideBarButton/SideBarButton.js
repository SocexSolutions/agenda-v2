import { Button } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import CircleIcon from '@mui/icons-material/Circle';

import styles from './SideBarButton.module.scss';

export default function SideBarButton({ topic, name, ...buttonProps }) {
  const disabled = topic.status === 'closed';
  const variant = topic.status === 'live' ? 'contained' : 'text';

  let abbreviation;
  if ( name.length > 30 ) {
    abbreviation = name.slice( 0, 30 ) + '...';
  }

  const button = (
    <Button
      className={styles.side_bar_button}
      size="small"
      disabled={disabled}
      variant={variant}
      {...buttonProps}
      endIcon={<CircleIcon className={styles.icon} />}
    >
      <p className={styles.button_text}>{abbreviation || name }</p>
    </Button>
  );

  // Only need tooltip if the name is too long
  if ( abbreviation ) {
    return (
      <Tooltip title={name} placement="right">
        {button}
      </Tooltip>
    );
  }

  return button;
}
