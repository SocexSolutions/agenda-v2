import styles from '../../../styles/Bundles/Meeting/DiscussionForm.module.css';
import Card from '../../Card';
import Button from '../../../components/Button.js';
import AddIcon from '@mui/icons-material/Add';

import { useState, useEffect } from 'react';

import client from '../../../store/client';

const TakeawayForm = ( props ) => {
  const [ loading, setLoading ]     = useState( true );
  const [ deleting, setDeleting ]   = useState('');
  const [ saving, setSaving ]       = useState( null );
  const [ creating, setCreating ]   = useState( false );
  const [ takeaways, setTakeaways ] = useState([]);
  const [ editingId, setEditingId ] = useState('');

  useEffect( () => {
    const fetchTakeaways = async() => {
      const res = await client.get( `topic/${ props.topic_id }/takeaways` );

      setTakeaways( res.data );
      setLoading( false );
    };

    if ( loading ) {
      fetchTakeaways();
    }
  }, [ loading ] );

  useEffect( () => {
    const create = async() => {
      const res = await client.post(
        'takeaway',
        {
          name: '',
          description: '',
          topic_id: props.topic_id
        }
      );

      setCreating( false );
      setTakeaways([ ...takeaways, res.data ]);
      setEditingId( res.data._id );
    };

    if ( creating ) {
      create();
    }
  }, [ creating ] );

  useEffect( () => {
    const save = async() => {
      await client.patch(
        `takeaway/${ saving._id }`,
        saving
      );
    };

    if ( saving ) {
      save();
      setSaving( null );
    }
  }, [ saving ] );

  useEffect( () => {
    const deleteT = async() => {
      await client.delete( `takeaway/${ deleting }` );
      setLoading( true );
    };

    if ( deleting ) {
      deleteT();
      setDeleting('');
    }
  }, [ deleting ] );

  const saveTakeaway = ( takeaway ) => {
    setEditingId( null );
    setSaving( takeaway );
  };

  const deleteTakeaway = ( _id ) => {
    setDeleting( _id );
  };

  const createTakeaway = () => {
    setCreating( true );
  };

  const takeawayCards = [];

  if ( takeaways.length ) {
    for ( const t of takeaways ) {
      const editing = editingId === t._id;
      if ( editing ) {
        takeawayCards.push(
          <Card
            setEditing={setEditingId}
            editing={ editingId === t._id }
            key={t._id}
            item={t}
            saveTakeaway={saveTakeaway}
            deleteTakeaway={deleteTakeaway}
          />
        );
      } else {
        takeawayCards.push(
          <Card
            setEditing={setEditingId}
            key={t._id}
            item={t}
            saveTakeaway={saveTakeaway}
            deleteTakeaway={deleteTakeaway}
          />
        );
      }
    }
  }

  return (
    <>
      <div className={styles.cardContainer}>
        {takeawayCards}
        <Button
          onClick={() => createTakeaway()}
          variant='icon'
          text='New'
          icon={<AddIcon />}
        />
      </div>
    </>
  );
};

export default TakeawayForm;
