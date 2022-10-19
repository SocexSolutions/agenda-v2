import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Fade from "@mui/material/Fade";

import Inbox from "../../../components/pages/Home/Inbox/Inbox";
import CreateFab from "../../../components/shared/CreateFab/CreateFab";

import client from "../../../api/client";

import shared from "../../../styles/Shared.module.css";
import styles from "../../../styles/pages/user/[id]/home.module.css";

import { notify } from "../../../store/features/snackbar";

const User = ( props ) => {

  const filtersConstuctor = { owner: '' };

  const [ loading, setLoading ] = useState( true );
  const [ ownedMeetings, setOwnedMeetings ] = useState([]);
  const [ participantMeetings, setParticMeetings ] = useState([]);
  const [ filters, setFilters ] = useState( filtersConstuctor );

  const user = useSelector((state) => state.user);

  async function load() {
    try {
      const res = await Promise.all([
        client.get(`participant/meetings/${user.email}`),
        client.get(`user/meetings/${user._id}`),
      ]);

      setParticMeetings(res[0].data);
      setOwnedMeetings(res[1].data);

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
  }, [user]);

  const meetings = ownedMeetings.concat(participantMeetings);

  return (
    <Fade in={!loading}>
      <div className={shared.page}>
        <div className={shared.container}>
          <h2 className={styles.page_title}>My Meetings</h2>
          <Inbox meetings={meetings} refresh={load} filters={filters}/>
        </div>
        <CreateFab />
      </div>
    </Fade>
  );
};

export default User;
