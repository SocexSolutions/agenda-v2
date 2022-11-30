import { TextField } from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { Box } from "@mui/material";

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
  const [purpose, setPurpose] = useState("");

  const [initialized, setInitialized] = useState(false);
  const [updateReady, setUpdateReady] = useState(false);

  const debouncedName = useDebounce(name, 250);
  const debouncedDate = useDebounce(date, 250);
  const debouncedPurpose = useDebounce(purpose, 250);

  useEffect(() => {
    if (!initialized && meeting) {
      setName(meeting.name);
      setDate(meeting.date);
      setPurpose(meeting.purpose);
      setInitialized(true);
    }
  }, [meeting]);

  useEffect(() => {
    if (initialized) {
      if (!updateReady) {
        setUpdateReady(true);
      }

      // Avoid sending patch after setName and setDate are called during
      // initialization.
      if (updateReady) {
        const updates = { name, purpose };

        // Don't send an update to the backend with a bad date
        if (debouncedDate && debouncedDate.toString() !== "Invalid Date") {
          updates.date = debouncedDate;
        }

        dispatch(
          meetingStore.actions.update({
            ...meeting,
            ...updates,
          })
        );
      }
    }
  }, [debouncedName, debouncedDate, debouncedPurpose, dispatch]);

  return (
    <div className={styles.meetingBar}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: "1em",
          marginBottom: "1em",
        }}
      >
        <TextField
          sx={{
            width: "100%",
            maxWidth: "400px",
          }}
          label="Meeting Name"
          size="small"
          value={name}
          placeholder="Meeting Name"
          onChange={(e) => setName(e.target.value)}
        />
        <DesktopDatePicker
          label="Meeting Date"
          inputFormat="MM/DD/YYYY"
          value={date}
          onChange={(e) => {
            if (e) {
              setDate(e.$d);
            }
          }}
          renderInput={(params) => {
            return <TextField {...params} size="small" />;
          }}
        />
      </Box>
      <TextField
        fullWidth
        multiline
        label="Purpose"
        size="small"
        value={purpose}
        onChange={(e) => setPurpose(e.target.value)}
      />
    </div>
  );
}

export default HeaderForm;
