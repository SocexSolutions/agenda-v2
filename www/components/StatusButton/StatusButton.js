import React from 'react';
import Button from '@mui/material/Button';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tag from '../Tag/Tag';
import { getStatusInfo } from '../../utils/status';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import styles from './StatusButton.module.scss';

export default function StatusButton({ status, setMeetingStatus }) {
  const [ open, setOpen ] = React.useState( false );
  const anchorRef = React.useRef( null );

  const handleToggle = () => {
    setOpen( ( prevOpen ) => !prevOpen );
  };

  const handleClose = ( event ) => {
    if ( anchorRef.current && anchorRef.current.contains( event.target ) ) {
      return;
    }

    setOpen( false );
  };

  const statusInfo = getStatusInfo({ status });

  if ( !statusInfo ) {
    return;
  }

  return (
    <React.Fragment>
      <Button
        variant="contained"
        ref={anchorRef}
        color={statusInfo.color}
        disableElevation
        endIcon={statusInfo.actions?.length ? <ArrowDropDownIcon /> : ''}
        onClick={handleToggle}
        disabled={!statusInfo.actions?.length}
      >
        {status}
      </Button>
      <Menu anchorEl={anchorRef.current} open={open} onClose={handleClose}>
        {statusInfo.actions.map( ( a ) => {
          const newStatusInfo = getStatusInfo({ status: a.newStatus });

          return (
            <MenuItem
              key={a.newStatus}
              onClick={() => {
                setOpen( false );
                setMeetingStatus( a.newStatus );
              }}
            >
              <div className={styles.action_button}>
                <p>{a.name}</p>
                <Tag
                  color={statusInfo.color}
                  size="small"
                  className={styles.first_tag}
                >
                  {status}
                </Tag>
                <ArrowForwardIcon className={styles.arrow} />
                <Tag
                  color={newStatusInfo.color}
                  size="small"
                  className={styles.second_tag}
                >
                  {a.newStatus}
                </Tag>
              </div>
            </MenuItem>
          );
        })}
      </Menu>
    </React.Fragment>
  );
}
