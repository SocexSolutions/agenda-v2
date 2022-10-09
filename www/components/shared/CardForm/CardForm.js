import PropTypes from 'prop-types';

import { Paper, TextField, Button } from '@mui/material';

import { useState } from 'react';

import styles from './CardForm.module.scss';

/**
 * @param {Object} item             - item that to display
 * @param {Function} updateItem   - save function for an item
 * @param {Function} destroyItem - delete function (called with items _id)
 */
const CardForm = ({ editing, setEditing, item, updateItem, destroyItem }) => {
  const [ name, setName ] = useState( item.name || '' );
  const [ description, setDescription ] = useState( item.description || '' );

  const onUpdate = () => {
    updateItem({ ...item, name, description });
  };

  console.log( 'item', description );

  const onDestroy = () => {
    destroyItem( item );
  };

  if ( !editing ) {
    return (
      <Paper
        elevation={2}
        onClick={() => setEditing( item._id )}
        className={styles.container}
      >
        <h4>{name}</h4>
        <p>{description}</p>
      </Paper>
    );
  }

  return (
    <Paper elevation={2} className={styles.container + ' ' + styles.editing}>
      <TextField
        className={styles.title_input}
        size="small"
        label="Title"
        onChange={( e ) => setName( e.target.value )}
        value={name}
      />
      <TextField
        className={styles.description}
        multiline
        rows={2}
        fullWidth
        size="small"
        label="Description"
        onChange={( e ) => setDescription( e.target.value )}
        value={description}
      />
      <div className={styles.buttonContainer}>
        <Button onClick={() => onDestroy()} size="small" color={'red'}>
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
    </Paper>
  );
};

CardForm.propTypes = {
  saveTakeaway: PropTypes.func
};

export default CardForm;
