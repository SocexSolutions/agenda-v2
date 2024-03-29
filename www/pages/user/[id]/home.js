import { useEffect, useState } from "react";
import Fade from "@mui/material/Fade";

import Inbox from "../../../components/pages/Home/Inbox/Inbox";
import CreateFab from "../../../components/shared/CreateFab/CreateFab";

import useDebounce from "../../../hooks/use-debounce";

import client from "../../../api/client";

import shared from "../../../styles/Shared.module.css";
import styles from "../../../styles/pages/user/[id]/home.module.css";

import { notify } from "../../../store/features/snackbar";

export default function Home({ store }) {
  const initialFilters = { owners: [], name: "" };

  const [loading, setLoading] = useState(true);
  const [meetings, setMeetings] = useState([]);
  const [owners, setOwners] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [meetingCount, setMeetingCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(0);

  const debouncedFilters = useDebounce(filters, 200);

  async function load() {
    const hasDeterminedPageSize = rowsPerPage > 0;

    if (!hasDeterminedPageSize) {
      return;
    }

    setLoading(true);

    const limit = rowsPerPage;
    const skip = limit * page;

    try {
      const owner_ids = filters.owners.map((owner) => owner._id);
      const res = await client.get(`/meeting`, {
        params: {
          ...filters,
          owners: owner_ids,
          skip,
          limit,
        },
      });

      setMeetings(res.data.meetings);
      setMeetingCount(res.data.count);
      !res.data.filtered && setOwners(res.data.owners);

      setLoading(false);
    } catch (err) {
      store.dispatch(
        notify({
          message: "Failed to fetch meeting: " + err.message,
          type: "danger",
        })
      );

      setLoading(false);
    }
  }

  const updateWindowDimensions = () => {
    const newHeight = window.innerHeight - 410;

    setRowsPerPage(Math.floor(newHeight / 64));
  };

  useEffect(() => {
    window.addEventListener("resize", updateWindowDimensions);

    return () => window.removeEventListener("resize", updateWindowDimensions);
  }, []);

  useEffect(() => {
    updateWindowDimensions();
  }, []);

  useEffect(() => {
    if (rowsPerPage) {
      load();
    }
  }, [debouncedFilters, page]);

  return (
    <div className={shared.page}>
      <div className={shared.container}>
        <h2 className={styles.page_title}>My Meetings</h2>
        <Fade in={!loading}>
          <div>
            <Inbox
              meetings={meetings}
              owners={owners}
              refresh={() => load()}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              setFilters={setFilters}
              filters={filters}
              totalMeetings={meetingCount}
              page={page}
              setPage={setPage}
              loading={loading}
            />
          </div>
        </Fade>
      </div>

      <CreateFab />
    </div>
  );
}
