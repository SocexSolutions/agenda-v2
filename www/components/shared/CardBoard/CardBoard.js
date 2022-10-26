import AddCircleIcon from "@mui/icons-material/AddCircle";
import Button from "@mui/material/Button";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import styles from "./CardBoard.module.css";

/**
 * General board component that displays a list of crud cards
 *
 * @param {Object} props
 * @param {Function} getAll - function to retrieve data
 * @param {Function} selector - selector function to get data from store
 * @param {Function} create - function that takes a payload and creates
 * a new item using the payload
 * @param {Function} update - function that takes a new version of an item and
 * updates it
 * @param {Function} destroy - function the takes an item and deletes it
 * @param {Component} Card - card to use
 * @param {string} itemName - name of item (ie 'takeaway', 'action item')
 */
const CardBoard = ({
  selector,
  getAll,
  create,
  update,
  destroy,
  Card,
  itemName,
}) => {
  const items = useSelector(selector);

  const [editingId, setEditingId] = useState("");
  const [initailized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initailized) {
      getAll();
      setInitialized(true);
    }
  }, [initailized, getAll]);

  const createItem = async () => {
    // TODO handle editing id changes (maybe just store an array of ids in store)
    create({ name: "", description: "" });
  };

  const updateItem = async (takeaway) => {
    setEditingId(null);

    update(takeaway);
  };

  const itemCards = [];

  if (items.length) {
    for (const item of items) {
      const editing = editingId === item._id;
      if (editing) {
        itemCards.push(
          <div className={styles.card_container} key={item._id}>
            <Card
              setEditing={setEditingId}
              editing={editingId === item._id}
              key={item._id}
              item={item}
              updateItem={updateItem}
              destroyItem={destroy}
            />
          </div>
        );
      } else {
        itemCards.push(
          <div className={styles.card_container} key={item._id}>
            <Card
              setEditing={setEditingId}
              key={item._id}
              item={item}
              updateItem={updateItem}
              destroyItem={destroy}
            />
          </div>
        );
      }
    }
  }

  return (
    <>
      {itemCards}
      <div className={styles.button_container}>
        <Button
          variant="text"
          size="large"
          className={styles.add_button}
          onClick={() => createItem()}
          startIcon={<AddCircleIcon className={styles.add_icon} />}
          disableElevation
        >
          Add {itemName}
        </Button>
      </div>
    </>
  );
};

export default CardBoard;
