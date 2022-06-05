import PropTypes from 'prop-types';

import Input  from './Input';
import Button from './Button';

import { useState } from 'react';

import styles from '../styles/components/Card.module.css';

/**
 * @param {Object} item             - item that to display
 * @param {Function} updateItem   - save function for an item
 * @param {Function} destroyItem - delete function (called with items _id)
 */
const Card = ({
  editing,
  setEditing,
  item,
  updateItem,
  destroyItem
}) => {
  const [ name, setName ]               = useState( item.name || null );
  const [ description, setDescription ] = useState( item.description || null );

  const onUpdate = () => {
    updateItem({ ...item, name, description });
  };

  const onDestroy = () => {
    destroyItem( item );
  };

  if ( !editing ) {
    return (
      <div
        className={styles.container}
        onClick={() => setEditing( item._id )}
      >
        <h2>{name}</h2>
        <p>{description}</p>
      </div>
    );
  }

  return (
    <div className={styles.container + ' ' + styles.editing}>
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
          onClick={() => onDestroy()}
          text="delete"
          size="small"
        />
        <Button
          onClick={() => onUpdate()}
          text="save"
          size="small"
        />
      </div>
    </div>
  );
};

Card.propTypes = {
  saveTakeaway: PropTypes.func
};

export default Card;
