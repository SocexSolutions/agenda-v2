import PropTypes from "prop-types";

import { TextField, Button } from "@mui/material";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { notify } from "../../../store/features/snackbar";

import styles from "./CardForm.module.scss";
import shared from "../../../styles/Shared.module.css";

/**
 * @param {Object} item          - item that to display
 * @param {Function} updateItem  - save function for an item
 * @param {Function} destroyItem - delete function (called with items _id)
 */
const CardForm = ({ item, updateItem, destroyItem }) => {
  const dispatch = useDispatch();

  const [name, setName] = useState(item.name || "");
  const [description, setDescription] = useState(item.description || "");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    // Assume new item if no name (save button will be disabled without one)
    if (!name) {
      setEditing(true);
    }
  });

  const onUpdate = () => {
    setEditing(false);

    if (!name) {
      dispatch(
        notify({
          message: `Name is required.`,
          type: "danger",
        })
      );
    } else {
      updateItem({ ...item, name, description });
    }
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
        label="Name"
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
          disabled={!name} // Disable save button if no name (its how we tell if its a new item)
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
