import styles from '../styles/Card.module.css';
import PropTypes from 'prop-types';

import Input from './Input';
import Button from './Button';

import { useState } from 'react';

/**
 * @param {Object} item             - item that to display
 * @param {Function} saveTakeaway   - save function for an item
 * @param {Function} deleteTakeaway - delete function (called with items _id)
 */
const Card = ({
  editing,
  setEditing,
  item,
  saveTakeaway,
  deleteTakeaway
}) => {
  const [ name, setName ]               = useState( item.name || null );
  const [ description, setDescription ] = useState( item.description || null );

  const onSave = () => {
    saveTakeaway({ ...item, name, description });
  };

  const onDelete = () => {
    deleteTakeaway( item._id );
  };

  if ( !editing ) {
    return (
      <div
        className={styles.container}
        onDoubleClick={() => setEditing( item._id )}
      >
        <h1>{name}</h1>
        <p>{description}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Input onChange={( e ) => setName( e.target.value ) } value={name}/>
      <Input
        multiLine={true}
        rows='5'
        value={description}
        variant='outlined'
        onChange={( e ) => setDescription( e.target.value )}
      />
      <div className={styles.buttonContainer}>
        <Button
          onClick={() => onDelete()}
          text="delete"
          size="small"
          type='danger'
        />
        <Button
          onClick={() => onSave()}
          text="save"
          size="small"
          type='success'
        />
      </div>
    </div>
  );
};

Card.propTypes = {
  saveTakeaway: PropTypes.func
};

export default Card;
