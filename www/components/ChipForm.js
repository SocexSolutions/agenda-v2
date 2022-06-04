import styles from '../styles/ChipForm.module.css';

import Chip   from './Chip';
import Input  from './Input';
import Button from './Button';

import { useState } from 'react';

/**
 * Form for editing chip arrays
 * @param {Object} props.items - array of objects displayed in chips
 * @param {String} props.itemKey - key unique among chips (will be displayed)
 * @param {String} props.itemName - name of chips (tags, participants... )
 * @param {Function} props.setItems - function to overwrite parent's item array
 */
function ChipForm( props ) {
  const [ input, setInput ] = useState('');

  function addChip( chip ) {
    const duplicates = props.items.filter( item => {
      return item[ props.itemKey ] === chip;
    });

    if ( duplicates.length ) {
      const msg = `Cannot create multiple ${ props.itemName }s with the same name`;

      // TODO swap with something sexier
      window.alert( msg );

      return;
    }

    props.items.unshift({ [ props.itemKey ]: chip });

    props.setItems([ ...props.items ]);
  }

  function deleteChip( index ) {
    props.items.splice( index, 1 );

    props.setItems([ ...props.items ]);
  }

  function handleChange( event ) {
    setInput( event.target.value );
  }

  function handleEnter( event ) {
    if ( event.key === 'Enter' ) {
      handleSubmit();
    }
  }

  function handleSubmit() {
    if ( input ) {
      addChip( input );
      setInput('');
    }
  }

  const chips = [];

  if ( props.items ) {
    for ( let i = 0; i < props.items.length; i++ ) {
      const item = props.items[ i ];

      chips.push(
        <Chip
          index={i}
          editing={true}
          text={item[ props.itemKey ]}
          key={item[ props.itemKey ]}
          deleteFunc={() => deleteChip( i )}
        />
      );
    }
  }

  return (
    <div className={styles.chipForm}>
      <div className={styles.chipContainer}>
        {chips}
      </div>
      <div className={styles.inputContainer}>
        <Input
          placeholder={props.itemKey}
          value={input}
          onChange={handleChange}
          onKeyPress={handleEnter}
        />
        <Button
          variant='outlined'
          name="submit"
          size="medium"
          onClick={handleSubmit}
          text="add"
          customClass={styles.addButton}
        />
      </div>
    </div>
  );
}

export default ChipForm;
