import styles from '../styles/CardBoard.module.css';

import Card   from './Card';
import Button from './Button.js';

import AddIcon from '@mui/icons-material/Add';

import { useState, useEffect } from 'react';

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
  const [ loading, setLoading ]       = useState( true );
  const [ destroying, setDestroying ] = useState('');
  const [ updating, setUpdating ]     = useState( null );
  const [ creating, setCreating ]     = useState( false );
  const [ items, setItems ]           = useState([]);
  const [ editingId, setEditingId ]   = useState('');

  useEffect( () => {
    const fetchItems = async() => {
      const res = await props.getAll();

      if ( Array.isArray( res ) ) {
        setItems( res );
      }

      setLoading( false );
    };

    fetchItems();
  }, [ loading ] );

  useEffect( () => {
    const create = async() => {
      const res = await props.create({
        name: '',
        description: ''
      });

      setCreating( false );
      setItems([ ...items, res ]);
      setEditingId( res._id );
    };

    if ( creating ) {
      create();
    }
  }, [ creating ] );

  useEffect( () => {
    const update = async() => {
      await props.update( updating._id, updating );
    };

    if ( updating ) {
      update();
      setUpdating( null );
    }
  }, [ updating ] );

  useEffect( () => {
    const destroy = async() => {
      await props.destroy( destroying );
      setLoading( true );
    };

    if ( destroying ) {
      destroy();
      setDestroying('');
    }
  }, [ destroying ] );

  const updateItem = ( takeaway ) => {
    setEditingId( null );
    setUpdating( takeaway );
  };

  const destroyItem = ( _id ) => {
    setDestroying( _id );
  };

  const createItem = () => {
    setCreating( true );
  };

  const itemCards = [];

  if ( items.length ) {
    for ( const item of items ) {
      console.log( item );
      const editing = editingId === item._id;
      if ( editing ) {
        itemCards.push(
          <Card
            setEditing={setEditingId}
            editing={ editingId === item._id }
            key={item._id}
            item={item}
            updateItem={updateItem}
            destroyItem={destroyItem}
          />
        );
      } else {
        itemCards.push(
          <Card
            setEditing={setEditingId}
            key={item._id}
            item={item}
            updateItem={updateItem}
            destroyItem={destroyItem}
          />
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
          variant='icon'
          text='New'
          icon={<AddIcon />}
        />
      </div>
    </>
  );
};

export default CardBoard;
