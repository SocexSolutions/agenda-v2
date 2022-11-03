import { TextField } from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

import debounce from "../../../../utils/debounce";

import meetingStore from "../../../../store/features/meeting";

import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";

import styles from "./HeaderForm.module.css";

const debouncedUpdate = debounce((data, dispatch) => {
  dispatch(meetingStore.actions.update(data));
}, 250);

function HeaderForm({ meetingId }) {
  const dispatch = useDispatch();

  const meeting = useSelector((state) =>
    meetingStore.selectors.get(state, meetingId)
  );

  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized && meeting) {
      setName(meeting.name);
      setDate(meeting.date);
      setInitialized(true);
    }
  }, [meeting]);

  const updateMeeting = () => {
    debouncedUpdate({ _id: meetingId, name, date }, dispatch);
  };

  return (
    <div className={styles.meetingBar}>
      <form className={styles.form}>
        <TextField
          className={styles.name_field}
          label="Meeting Name"
          size="small"
          value={name}
          placeholder="Meeting Name"
          onChange={(e) => {
            setName(e.target.value);
            updateMeeting();
          }}
        />
        <DesktopDatePicker
          className={styles.date_picker}
          label="Meeting Date"
          inputFormat="MM/DD/YYYY"
          value={date}
          onChange={(e) => {
            setDate(e.$d);

            if (e.$d !== "Invalid Date") {
              updateMeeting({ date: e.$d });
            }
          }}
          renderInput={(params) => {
            return <TextField {...params} size="small" />;
          }}
        />
      </form>
    </div>
  );
}

export default HeaderForm;
