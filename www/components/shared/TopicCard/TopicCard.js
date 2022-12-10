import { TextField, Button } from "@mui/material";

import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";

import topicStore from "../../../store/features/topic";

import { useState } from "react";
import { useDispatch } from "react-redux";

import styles from "./TopicCard.module.scss";

export default function TopicCard({ topic, deleteUnsaved, className }) {
  const dispatch = useDispatch();

  const [editing, setEditing] = useState(topic._id.includes("temp"));
  const [name, setName] = useState(topic.name);
  const [description, setDescription] = useState(topic.description);

  const onSave = () => {
    setEditing(false);

    // When a topic is created, it receives a temp id until it is saved.
    // Thus, if the topic has an id starting with temp, we need to create
    // it.
    if (topic._id.startsWith("temp")) {
      dispatch(
        topicStore.actions.create({
          meeting_id: topic.meeting_id,
          name,
          description,
        })
      );

      deleteUnsaved(topic._id);
    } else {
      dispatch(
        topicStore.actions.update({
          _id: topic._id,
          meeting_id: topic.meeting_id,
          name,
          description,
        })
      );
    }
  };

  const onDelete = () => {
    // When a topic is created, it receives a temp id until it is saved.
    // Thus, if the topic has an id starting with temp, we can just delete
    // it from the store.
    if (topic._id.startsWith("temp")) {
      deleteUnsaved(topic._id);
    } else {
      dispatch(topicStore.actions.delete(topic));
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
        className={`${styles.card} ${styles.clickable} ${className}`}
        onClick={() => setEditing(true)}
      >
        <div className={styles.content_container}>
          <h4 className={styles.name}>{name}</h4>
          {description && <p className={styles.description}>{description}</p>}
        </div>
        <div className={styles.icon_container}>
          <QuestionAnswerIcon color="primary" className={styles.icon} />
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.card} ${className}`}>
      <div className={styles.content_container}>
        <TextField
          label="Name"
          variant="outlined"
          size="small"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={maybeHandleShortcut}
          className={styles.name_input}
        />
        <TextField
          label="Description"
          variant="outlined"
          size="small"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={maybeHandleShortcut}
          className={styles.description_input}
          multiline
          minRows={3}
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
        <QuestionAnswerIcon color="primary" className={styles.icon} />
      </div>
    </div>
  );
}
