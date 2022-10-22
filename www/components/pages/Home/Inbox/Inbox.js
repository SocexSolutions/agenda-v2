import { Button, TextField, Autocomplete, Pagination } from '@mui/material';
import InboxRow from './InboxRow/InboxRow';
import meetingAPI from '../../../../api/meeting';
import { useRouter } from 'next/router';
import { useState } from 'react';
import styles from './Inbox.module.scss';
import classNames from 'classnames';
import FilterListIcon from '@mui/icons-material/FilterList';

import { height } from '@mui/system';

/**
 * Table that displays users meetings
 * @param {Object[]} meetings - meetings to display
 * @param {Function} refresh - a function that refreshes the meetings
 */
<<<<<<< HEAD
export default function Inbox({ meetings, refresh }) {
=======
export default function Inbox({
  meetings,
  emptyMessage,
  refresh,
  setFilters,
  filters,
  totalMeetings,
  setSkip
}) {
>>>>>>> 3b83c49 (finished filters and added pagination)
  const router = useRouter();

  const [ filtersOpen, setFiltersOpen ] = useState( false );

  console.log( totalMeetings );
  const itemsPerPage = 14;

  const lineItems = meetings.map( ( meeting ) => {
    return (
      <InboxRow
        meeting={meeting}
        key={meeting._id}
        classes={styles.row}
        refresh={refresh}
      />
    );
  });

  const handleNameChange = ( event ) => {
    setFilters( prevState => ({ ...prevState, name: event.target.value }) );
  };

  const handleOwnersChange = ( event, value ) => {
    setFilters( prevState => ({ ...prevState, owners: value }) );
  };

  const users = [ ...new Set( meetings.map( item => item.owner_id ) ) ];

  if ( lineItems.length || filters.name ) {
    return (
      <>
        <div className={styles.table}>
          <div className={classNames( styles.filter_box, filtersOpen && styles.filter_box_open ) } >
            <div className={styles.visible}>
              <TextField
                placeholder='Search'
                variant='standard'
                size='small'
                onChange={handleNameChange}/>
              <Button
                onClick={() => setFiltersOpen( !filtersOpen )}
                endIcon={<FilterListIcon />} >
              Filters
              </ Button>
            </ div>
            <div className={styles.hidden}>
              <Autocomplete
                multiple
                options={users}
                onChange={handleOwnersChange}
                sx={{ width: 400, height: 100 }}
                renderInput={( params ) => <TextField {...params} size='small' label="Owner" />}
              />
            </div>
          </div>
          {lineItems}
        </div>
        <Pagination
          count={Math.ceil( totalMeetings / itemsPerPage )}
          onChange={( event, pageNumber ) => setSkip( itemsPerPage * ( pageNumber - 1 ) )}
        />
      </>
    );
  }

  const createMeeting = async () => {
    // create a draft meeting before redirect so that created participants
    // and topics have a meeting_id to reference
    const res = await meetingAPI.create({ name: "Draft", date: new Date() });

    router.push(`/meeting/${res._id}/edit`);
  };

  return (
    <div className={styles.no_meetings}>
      <h3>No meetings :(</h3>
      <p>Create your first meeting!</p>
      <Button
        variant="contained"
        size="large"
        color="blue"
        onClick={() => createMeeting()}
        disableElevation
      >
        Create Meeting
      </Button>
    </div>
  );
}
