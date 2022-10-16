import AddCircleIcon from '@mui/icons-material/AddCircle';
import Button        from '@mui/material/Button';

import { useState, useEffect } from 'react';

import styles from './CardBoard.module.css';

/**
 * General board component that displays a list of crud cards
 *
 * @param {Object} props
 * @param {string} change - key used to determine if board should reload
 * @param {Function} getAll - async function that gets all items to be
 * displayed on board
 * @param {Function} create - function that takes a payload and creates
 * a new item
 * @param {Function} update - function that takes an id and payload and
 * updates the corresponding item
 * @param {Function} destroy - function the takes an id and deletes the
 * corresponding item
 * @param {Component} Card - card to use
 * @param {string} itemName - name of item (ie 'takeaway', 'action item')
 */
const CardBoard = ({ change, getAll, create, update, destroy, Card, itemName }) => {
  const [ items, setItems ]         = useState([]);
  const [ editingId, setEditingId ] = useState('');

  const fetchItems = async() => {
    const res = await getAll();

    if ( Array.isArray( res ) ) {
      setItems( res );
    }
  };

  useEffect( () => {
    const load = async() => {
      await fetchItems();
    };

    // Check that the change prop exists before attempting to load since we
    // know the component is dependant on it.
    if ( change ) {
      load();
    }
  }, [ change ] );

  const createItem = async() => {
    const { _id } = await create({
      name: '',
      description: ''
    });

    setEditingId( _id );

    fetchItems();
  };

  const updateItem = async( takeaway ) => {
    setEditingId( null );

    await update( takeaway._id, takeaway );

    fetchItems();
  };

  const destroyItem = async( takeaway ) => {
    await destroy( takeaway._id );

    fetchItems();
  };

  const itemCards = [];

  if ( items.length ) {
    for ( const item of items ) {
      const editing = editingId === item._id;
      if ( editing ) {
        itemCards.push(
          <div className={styles.card_container} key={item._id}>
            <Card
              setEditing={setEditingId}
              editing={ editingId === item._id }
              key={item._id}
              item={item}
              updateItem={updateItem}
              destroyItem={destroyItem}
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
              destroyItem={destroyItem}
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
