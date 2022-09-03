import Card   from '../Card/Card';
import Button from '../Button/Button';

import AddIcon from '@mui/icons-material/Add';

import { useState, useEffect } from 'react';

import styles from './CardBoard.module.css';

/**
 * General board component that displays a list of crud cards
 *
 * @param {Object} props
 * @property {String} change - key used to determine if board should reload
 * @property {Function} getAll - async function that gets all items to be
 * displayed on board
 * @property {Function} create - function that takes a payload and creates
 * a new item
 * @property {Function} update - function that takes an id and payload and
 * updates the corresponding item
 * @property {Function} destroy - function the takes an id and deletes the
 * corresponding item
 */
const CardBoard = ( props ) => {
  const [ initLoad, setInitLoad ]   = useState( true );
  const [ items, setItems ]         = useState([]);
  const [ editingId, setEditingId ] = useState('');

  const fetchItems = async() => {
    const res = await props.getAll();

    if ( Array.isArray( res ) ) {
      setItems( res );
    }
  };

  useEffect( () => {
    const load = async() => {
      await fetchItems();
      setInitLoad( false );
    };

    if ( initLoad ) {
      load();
    }
  }, [ initLoad ] );

  const createItem = async() => {
    const { _id } = await props.create({
      name: '',
      description: ''
    });

    setEditingId( _id );

    fetchItems();
  };

  const updateItem = async( takeaway ) => {
    setEditingId( null );

    await props.update( takeaway._id, takeaway );

    fetchItems();
  };

  const destroyItem = async( takeaway ) => {
    await props.destroy( takeaway._id );

    fetchItems();
  };

  const itemCards = [];

  if ( items.length ) {
    for ( const item of items ) {
      const editing = editingId === item._id;
      if ( editing ) {
        itemCards.push(
          <div className={styles.card_container}>
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
          <div className={styles.card_container}>
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
          className={styles.add_button}
          onClick={() => createItem()}
          variant='iconInverted'
          text='New'
          icon={<AddIcon />}
        />
      </div>
    </>
  );
};

export default CardBoard;
