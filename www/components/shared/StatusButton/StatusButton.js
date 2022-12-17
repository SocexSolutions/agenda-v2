import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import Tag from "../Tag/Tag";

import meetingStore from "../../../store/features/meeting";

import { useDispatch } from "react-redux";

import { useState, useRef } from "react";

import { getStatusInfo } from "../../../utils/meeting-status";

import styles from "./StatusButton.module.scss";

export default function StatusButton({ meeting, editable }) {
  const dispatch = useDispatch();
  const anchorRef = useRef(null);

  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    if (!editable) {
      return;
    }

    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const setMeetingStatus = (status) => {
    dispatch(meetingStore.actions.updateStatus(meeting._id, status));
  };

  const statusInfo = getStatusInfo(meeting);

  if (!statusInfo) {
    return;
  }

  const statusButtonClasses = [styles.status_button];

  if (editable) {
    statusButtonClasses.push(styles.editable);
  }

  return (
    <>
      <Button
        variant="contained"
        className={statusButtonClasses.join(" ")}
        ref={anchorRef}
        color={statusInfo.color}
        disableElevation
        endIcon={
          statusInfo.actions?.length && editable ? <ArrowDropDownIcon /> : ""
        }
        onClick={handleToggle}
        disabled={!statusInfo.actions?.length}
      >
        {meeting.status}
      </Button>
      <Menu anchorEl={anchorRef.current} open={open} onClose={handleClose}>
        {statusInfo.actions.map((a) => {
          const newStatusInfo = getStatusInfo({ status: a.newStatus });

          return (
            <MenuItem
              key={a.newStatus}
              onClick={() => {
                setOpen(false);
                setMeetingStatus(a.newStatus);
              }}
            >
              <div className={styles.action_button}>
                <p>{a.name}</p>
                <Tag
                  color={statusInfo.color}
                  size="small"
                  className={styles.first_tag}
                >
                  {meeting.status}
                </Tag>
                <ArrowForwardIcon className={styles.arrow} />
                <Tag
                  color={newStatusInfo.color}
                  size="small"
                  className={styles.second_tag}
                >
                  {a.newStatus}
                </Tag>
              </div>
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}
