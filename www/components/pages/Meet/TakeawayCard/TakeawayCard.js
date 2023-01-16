import { TextField, Button } from "@mui/material";

import LightbulbIcon from "@mui/icons-material/Lightbulb";

import takeawayStore from "../../../../store/features/takeaway";

import { useState } from "react";
import { useDispatch } from "react-redux";

import styles from "./TakeawayCard.module.scss";
import shared from "../../../../styles/Shared.module.css";

export default function TakeawayCard({ takeaway, deleteUnsaved, className }) {
  const dispatch = useDispatch();

  const [editing, setEditing] = useState(takeaway._id.includes("temp"));
  const [name, setName] = useState(takeaway.name);
  const [description, setDescription] = useState(takeaway.description);

  const onSave = () => {
    setEditing(false);

    // When an takeaway is created, it receives a temp id until it is saved.
    // Thus, if the takeaway has an id starting with temp, we need to create
    // it.
    if (takeaway._id.startsWith("temp")) {
      dispatch(
        takeawayStore.actions.create({
          meeting_id: takeaway.meeting_id,
          topic_id: takeaway.topic_id,
          name,
          description,
        })
      );
      deleteUnsaved(takeaway._id);
    } else {
      dispatch(
        takeawayStore.actions.update({
          _id: takeaway._id,
          meeting_id: takeaway.meeting_id,
          topic_id: takeaway.topic_id,
          name,
          description,
        })
      );
    }
  };

  const onDelete = () => {
    // When an takeaway is created, it receives a temp id until it is saved.
    // Thus, if the takeaway has an id starting with temp, we only need to
    // delete it from the parent component's state.
    if (takeaway._id.startsWith("temp")) {
      deleteUnsaved(takeaway._id);
    } else {
      dispatch(takeawayStore.actions.delete(takeaway));
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
        </div>
        <div className={styles.icon_container}>
          <LightbulbIcon color="yellow" className={styles.icon} />
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
        <LightbulbIcon color="yellow" className={styles.icon} />
      </div>
    </div>
  );
}
