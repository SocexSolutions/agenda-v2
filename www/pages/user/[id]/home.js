import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Fade from "@mui/material/Fade";

import Inbox from "../../../components/pages/Home/Inbox/Inbox";
import CreateFab from "../../../components/shared/CreateFab/CreateFab";

import client from "../../../api/client";

import shared from "../../../styles/Shared.module.css";
import styles from "../../../styles/pages/user/[id]/home.module.css";

import { notify } from "../../../store/features/snackbar";

const User = (props) => {
  const initialFilters = { owners: [], name: "" };

  const [loading, setLoading] = useState(true);
  const [fetchingMeetings, setFetchingMeetings] = useState(true);
  const [meetings, setMeetings] = useState([]);
  const [owners, setOwners] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [meetingCount, setMeetingCount] = useState(0);
  const [skip, setSkip] = useState(0);

  const user = useSelector((state) => state.user);

  async function load() {
    try {
      const res = await client.get(`/meeting/?skip=${skip}&limit=14`, {
        params: filters,
      });

      setMeetings(res.data.meetings);
      setMeetingCount(res.data.count);
      !res.filtered && setOwners(res.data.owners)

      setFetchingMeetings(false);
      setLoading(false);
    } catch (err) {
      props.store.dispatch(
        notify({
          message: "Failed to fetch meeting: " + err.message,
          type: "danger",
        })
      );
    }
  }

  useEffect(() => {
    if (user._id) {
      load();
    }
  }, [user, filters, skip]);

  return (
    <Fade in={!loading}>
      <div className={shared.page}>
        <div className={shared.container}>
          <h2 className={styles.page_title}>My Meetings</h2>
          <Inbox
            meetings={meetings}
            owners={owners}
            refresh={load}
            setFilters={setFilters}
            filters={filters}
            totalMeetings={meetingCount}
            setSkip={setSkip}
            fetchingMeetings={fetchingMeetings}
            setFetchingMeetings={setFetchingMeetings}
          />
        </div>
        <CreateFab />
      </div>
    </Fade>
  );
};

export default User;
