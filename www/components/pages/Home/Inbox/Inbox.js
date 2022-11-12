import {
  Button,
  TextField,
  Autocomplete,
  Pagination,
  CircularProgress,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import InboxRow from "./InboxRow/InboxRow";

import meetingAPI from "../../../../api/meeting";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import styles from "./Inbox.module.scss";

import { height } from "@mui/system";

/**
 * Table that displays users meetings
 * @param {Object[]} meetings - meetings to display
 * @param {Function} refresh - a function that refreshes the meetings
 */
export default function Inbox({
  meetings,
  owners,
  emptyMessage,
  refresh,
  setFilters,
  filters,
  totalMeetings,
  setSkip,
  setFetchingMeetings,
  fetchingMeetings,
}) {
  const router = useRouter();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filter_box_classes =
    styles.filter_box + " " + (filtersOpen && styles.filter_box_open);

  const lineItems = meetings.map((meeting) => {
    return (
      <InboxRow
        meeting={meeting}
        key={meeting._id}
        classes={styles.row}
        refresh={refresh}
      />
    );
  });

  const handleNameChange = (event) => {
    setFilters((prevState) => ({ ...prevState, name: event.target.value }));
    setFetchingMeetings(true);
  };

  const handleOwnersChange = (event, value) => {
    setFilters((prevState) => ({ ...prevState, owners: value.map(owner => owner._id) }));
  };

  const itemsPerPage = 14;

  if (lineItems.length || filters.name || fetchingMeetings) {
    return (
      <>
        <div className={styles.table}>
          <div className={filter_box_classes}>
            <div className={styles.visible}>
              <TextField
                placeholder="Search"
                variant="standard"
                size="small"
                onChange={handleNameChange}
              />
              <Button
                onClick={() => setFiltersOpen(!filtersOpen)}
                endIcon={<FilterListIcon />}
              >
                Filters
              </Button>
            </div>
            <div className={styles.hidden}>
              <Autocomplete
                multiple
                options={owners}
                getOptionLabel={(owners) => owners.username}
                onChange={handleOwnersChange}
                sx={{ width: 400, height: 100 }}
                renderInput={(params) => (
                  <TextField {...params} size="small" label="Owner" />
                )}
              />
            </div>
          </div>
          {lineItems}
        </div>
        <Pagination
          count={Math.ceil(totalMeetings / itemsPerPage)}
          onChange={(event, pageNumber) =>
            setSkip(itemsPerPage * (pageNumber - 1))
          }
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
