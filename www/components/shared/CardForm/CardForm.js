import PropTypes from "prop-types";

import { TextField, Button } from "@mui/material";

import { useState } from "react";

import styles from "./CardForm.module.scss";
import shared from "../../../styles/Shared.module.css";

/**
 * @param {Object} item          - item that to display
 * @param {Function} updateItem  - save function for an item
 * @param {Function} destroyItem - delete function (called with items _id)
 */
const CardForm = ({ editing, setEditing, item, updateItem, destroyItem }) => {
  const [name, setName] = useState(item.name || "");
  const [description, setDescription] = useState(item.description || "");

  const onUpdate = () => {
    updateItem({ ...item, name, description });
  };

  const onDestroy = () => {
    destroyItem(item);
  };

  /**
   * Handles keyboard shortcuts for quickly saving or exiting from a card.
   */
  const maybeHandleShortcut = (e) => {
    if (e.key === "Enter" && e.metaKey) {
      onUpdate();
    }
  };

  if (!editing) {
    return (
      <div
        className={shared.card + " " + styles.container}
        onClick={() => setEditing(item._id)}
      >
        <h4 className={styles.name}>{name}</h4>
        {description && <p className={styles.description}>{description}</p>}
      </div>
    );
  }

  return (
    <div
      className={shared.card + " " + styles.container + " " + styles.editing}
      elevation={1}
    >
      <TextField
        autoFocus
        className={styles.name_input}
        size="small"
        label="Title"
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => maybeHandleShortcut(e)}
        value={name}
      />
      <TextField
        className={styles.description}
        multiline
        rows={3}
        fullWidth
        size="small"
        label="Description"
        onChange={(e) => setDescription(e.target.value)}
        onKeyDown={(e) => maybeHandleShortcut(e)}
        value={description}
      />
      <div className={styles.button_container}>
        <Button onClick={() => onDestroy()} size="small" color={"red"}>
          delete
        </Button>
        <Button
          onClick={() => onUpdate()}
          size="small"
          variant="contained"
          disableElevation
        >
          save
        </Button>
      </div>
    </div>
  );
};

CardForm.propTypes = {
  saveTakeaway: PropTypes.func,
};

export default CardForm;
