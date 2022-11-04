import { TextField } from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

import useDebounce from "../../../../hooks/use-debounce";

import meetingStore from "../../../../store/features/meeting";

import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";

import styles from "./HeaderForm.module.css";

function HeaderForm({ meetingId }) {
  const dispatch = useDispatch();

  const meeting = useSelector((state) =>
    meetingStore.selectors.get(state, meetingId)
  );

  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [initialized, setInitialized] = useState(false);
  const [updateReady, setUpdateReady] = useState(false);

  const debouncedName = useDebounce(name, 250);
  const debouncedDate = useDebounce(date, 250);

  useEffect(() => {
    if (meeting) {
      setName(meeting.name);
      setDate(meeting.date);
      setInitialized(true);
    }
  }, [meeting]);

  useEffect(() => {
    if (initialized) {
      if (!updateReady) {
        setUpdateReady(true);
      }

      // Avoid sending patch after setName and setDate are called during
      // initalization.
      if (updateReady) {
        dispatch(
          meetingStore.actions.update({
            ...meeting,
            date: debouncedDate,
            name: debouncedName,
          })
        );
      }
    }
  }, [debouncedName, debouncedDate, dispatch]);

  return (
    <div className={styles.meetingBar}>
      <form className={styles.form}>
        <TextField
          className={styles.name_field}
          label="Meeting Name"
          size="small"
          value={name}
          placeholder="Meeting Name"
          onChange={(e) => setName(e.target.value)}
        />
        <DesktopDatePicker
          className={styles.date_picker}
          label="Meeting Date"
          inputFormat="MM/DD/YYYY"
          value={date}
          onChange={(e) => setDate(e.$d)}
          renderInput={(params) => {
            return <TextField {...params} size="small" />;
          }}
        />
      </form>
    </div>
  );
}

export default HeaderForm;
