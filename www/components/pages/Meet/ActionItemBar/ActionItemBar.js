import { useEffect, useState } from 'react';

import { Checkbox } from '@mui/material';

import meetingAPI from '../../../../api/meeting';
import actionItemAPI from '../../../../api/action-item';

import styles from './ActionItemBar.module.scss';

export default function ActionItemBar({ meetingId }) {
  const [ actionItems, setActionItems ] = useState([]);

  // TODO use store or context to share action items

  const loadActionItems = async( meetingId ) => {
    const res = await meetingAPI.getActionItems( meetingId );

    setActionItems( res );
  };

  const setCompletion = async( actionItemId, completed ) => {
    await actionItemAPI.update( actionItemId, {
      completed
    });

    loadActionItems( meetingId );
  };

  useEffect( () => {
    if ( meetingId ) {
      loadActionItems( meetingId );
    }
  }, [ meetingId ] );

  const actionItemsMarkup =
    actionItems.length > 0 ? (
      actionItems.map( ( actionItem ) => {
        return (
          <div className={styles.action_item} key={actionItem._id}>
            <Checkbox
              onClick={( e ) => setCompletion( actionItem._id, e.target.checked )}
              checked={actionItem.completed}
            />
            <p>{actionItem.name}</p>
          </div>
        );
      })
    ) : (
      <p>No action items.</p>
    );

  return (
    <div className={styles.action_item_bar}>
      <h3>Meeting Action Items</h3>
      {actionItemsMarkup}
    </div>
  );
}
