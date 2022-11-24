import { TextField, Autocomplete, Button, Chip } from "@mui/material";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

import actionItemStore from "../../../../store/features/action-item";
import meetingStore from "../../../../store/features/meeting";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import styles from "./ActionItemCard.module.scss";
import shared from "../../../../styles/Shared.module.css";
export default function ActionItemCard({
  actionItem,
  deleteUnsaved,
  className,
}) {
  const dispatch = useDispatch();

  const participants = useSelector((state) =>
    meetingStore.selectors.participants(state, actionItem.meeting_id)
  );

  const [editing, setEditing] = useState(actionItem._id.includes("temp"));
  const [name, setName] = useState(actionItem.name);
  const [description, setDescription] = useState(actionItem.description);
  const [assignedTo, setAssignedTo] = useState(actionItem.assigned_to);

  const onSave = () => {
    setEditing(false);

    // When an action item is created, it receives a temp id until it is saved.
    // Thus, if the action item has an id starting with temp, we need to create
    // it.
    if (actionItem._id.startsWith("temp")) {
      dispatch(
        actionItemStore.actions.create({
          meeting_id: actionItem.meeting_id,
          topic_id: actionItem.topic_id,
          name,
          description,
          assigned_to: assignedTo,
        })
      );
      deleteUnsaved(actionItem._id);
    } else {
      dispatch(
        actionItemStore.actions.update({
          _id: actionItem._id,
          meeting_id: actionItem.meeting_id,
          topic_id: actionItem.topic_id,
          name,
          description,
          assigned_to: assignedTo,
        })
      );
    }
  };

  const onDelete = () => {
    // When an action item is created, it receives a temp id until it is saved.
    // Thus, if the action item has an id starting with temp, we only need to
    // delete it from the parent component's state.
    if (actionItem._id.startsWith("temp")) {
      deleteUnsaved(actionItem._id);
    } else {
      dispatch(actionItemStore.actions.delete(actionItem));
    }
  };

  const maybeHandleShortcut = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      onSave();
    }
  };

  if (!editing) {
    return (
      <div
        className={`${shared.card} ${className} ${styles.clickable} ${styles.card}`}
        onClick={() => setEditing(true)}
      >
        <div className={styles.content_container}>
          <h4 className={styles.name}>{name}</h4>
          {description && <p className={styles.description}>{description}</p>}
          {assignedTo.length > 0 && (
            <div className={styles.assigned_to}>
              {assignedTo.map((email) => (
                <Chip
                  label={email}
                  key={email}
                  size="small"
                  sx={{
                    marginRight: "0.5em",
                    marginBottom: "0.5em",
                  }}
                />
              ))}
            </div>
          )}
        </div>
        <div className={styles.icon_container}>
          <TaskAltIcon color="blue" className={styles.icon} />
        </div>
      </div>
    );
  }

  return (
    <div className={`${shared.card} ${className} ${styles.card}`}>
      <div className={styles.content_container}>
        <TextField
          autoFocus
          className={`${styles.name_input} ${styles.input}`}
          fullWidth
          size="small"
          label="Name"
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => maybeHandleShortcut(e)}
          value={name}
        />
        <TextField
          className={`${styles.description} ${styles.input}`}
          multiline
          minRows={3}
          fullWidth
          size="small"
          label="Description"
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={(e) => maybeHandleShortcut(e)}
          value={description}
        />
        <Autocomplete
          multiple
          size="small"
          className={`${styles.input}`}
          options={participants.map((p) => p.email)}
          value={assignedTo}
          label="Assigned To"
          onKeyDown={(e) => maybeHandleShortcut(e)}
          onChange={(e, newValue) => {
            setAssignedTo(newValue);
          }}
          renderInput={(params) => (
            <TextField {...params} label="Assigned To" />
          )}
        />
        <div className={styles.button_container}>
          <Button onClick={() => onDelete()} size="small" color={"red"}>
            delete
          </Button>
          <Button
            disabled={!name}
            onClick={() => onSave()}
            size="small"
            variant="contained"
            disableElevation
          >
            save
          </Button>
        </div>
      </div>
      <div className={styles.icon_container}>
        <TaskAltIcon color="blue" className={styles.icon} />
      </div>
    </div>
  );
}
