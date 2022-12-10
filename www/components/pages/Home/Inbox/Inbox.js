import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";

import Filters from "./Filters/Filters";
import MeetingModal from "./MeetingModal/MeetingModal";
import StatusChip from "../../../shared/StatusChip/StatusChip";

import { prettyDate } from "../../../../utils/pretty-date";

import meetingAPI from "../../../../api/meeting";

import { useRouter } from "next/router";

import useDebounce from "../../../../hooks/use-debounce";

import { useState, useEffect } from "react";

import styles from "./Inbox.module.scss";

/**
 * Table that displays users meetings
 * @param {Object[]} meetings - meetings to display
 * @param {Function} refresh - a function that refreshes the meetings
 */
export default function Inbox({
  meetings,
  owners,
  refresh,
  loading,
  setFilters,
  filters,
  totalMeetings,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
}) {
  const router = useRouter();

  const [meetingId, setMeetingId] = useState(null);

  const debouncedRowsPerPage = useDebounce(rowsPerPage, 250);

  const createMeeting = async () => {
    // create a draft meeting before redirect so that created participants
    // and topics have a meeting_id to reference
    const res = await meetingAPI.create({ name: "Draft", date: new Date() });

    router.push(`/meeting/${res._id}/edit`);
  };

  useEffect(() => {
    const updateWindowDimensions = () => {
      const newHeight = window.innerHeight - 200;

      setRowsPerPage(Math.floor(newHeight / 90));
    };

    window.addEventListener("resize", updateWindowDimensions);

    return () => window.removeEventListener("resize", updateWindowDimensions);
  }, []);

  useEffect(() => {
    refresh();
  }, [debouncedRowsPerPage]);

  if (!meetings && !loading) {
    return (
      <div className={styles.no_meetings}>
        <h3>No meetings 😢</h3>
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

  return (
    <div className={styles.container}>
      <Filters filters={filters} setFilters={setFilters} owners={owners} />
      <TableContainer className={styles.table_container}>
        <Table>
          <TableHead>
            <TableRow className={styles.table_header}>
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Owner</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {meetings.map((meeting) => (
              <TableRow
                key={meeting._id}
                className={styles.table_row}
                onClick={() => setMeetingId(meeting._id)}
              >
                <TableCell>{meeting.name}</TableCell>
                <TableCell>
                  <StatusChip status={meeting.status} size="small" />
                </TableCell>
                <TableCell>
                  <Chip label={meeting.owner.email} size="small" />
                </TableCell>
                <TableCell>{prettyDate(meeting.date)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[rowsPerPage]}
          component="div"
          count={totalMeetings}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, page) => setPage(page)}
        />
      </TableContainer>
      <MeetingModal
        open={!!meetingId}
        onClose={() => setMeetingId(null)}
        meeting={meetings.find((meeting) => meeting._id === meetingId)}
        refresh={refresh}
      />
    </div>
  );
}
