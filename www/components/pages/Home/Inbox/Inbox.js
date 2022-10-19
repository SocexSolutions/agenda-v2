import { Button, TextField, Autocomplete } from '@mui/material';
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
export default function Inbox({ meetings, refresh }) {
  const router = useRouter();

  const [ filtersOpen, setFiltersOpen ] = useState( false );

  console.log(meetings)

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

  const top100Films = [
    { label: 'Rimp', year: 1994 },
    { label: 'Jogn', year: 1972 },
    { label: 'Mercedes', year: 1974 },
    { label: 'David', year: 2008 },
    { label: 'Alison', year: 1957 },
    { label: 'Zach', year: 1993 },
    { label: 'Tom', year: 1994 }
  ];

  if ( lineItems.length ) {
    return (
      <div className={styles.table}>
        <div className={classNames( styles.filter_box, filtersOpen && styles.filter_box_open ) } >
          <div className={styles.visible}>
            <TextField placeholder='Search' variant='standard' size='small' />
            <Button
              onClick={() => setFiltersOpen( !filtersOpen )}
              endIcon={<FilterListIcon />} >
              Filters
            </ Button>
          </ div>
          <div className={styles.hidden}>
            <Autocomplete
              options={top100Films}
              sx={{ width: 200, height: 100 }}
              renderInput={( params ) => <TextField {...params} size='small' label="Owner" />}
            />
          </div>
        </div>
        {lineItems}
      </div>
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
