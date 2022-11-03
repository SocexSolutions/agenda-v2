import AddCircleIcon from "@mui/icons-material/AddCircle";
import Button from "@mui/material/Button";

import { useSelector } from "react-redux";

import styles from "./CardBoard.module.css";

/**
 * General board component that displays a list of crud cards
 *
 * @param {Object} props
 * @param {Function} selector - selector function to get data from store
 * @param {Function} create - function that takes a payload and creates
 * a new item using the payload
 * @param {Function} update - function that takes a new version of an item and
 * updates it
 * @param {Function} destroy - function the takes an item and deletes it
 * @param {Component} Card - card to use
 * @param {string} itemName - name of item (ie 'takeaway', 'action item')
 */
const CardBoard = ({ selector, create, update, destroy, Card, itemName }) => {
  const items = useSelector(selector);

  const createItem = async () => {
    create({ name: "", description: "" });
  };

  const itemCards = [];

  if (items.length) {
    for (const item of items) {
      itemCards.push(
        <div className={styles.card_container} key={item._id}>
          <Card
            key={item._id}
            item={item}
            updateItem={update}
            destroyItem={destroy}
          />
        </div>
      );
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
