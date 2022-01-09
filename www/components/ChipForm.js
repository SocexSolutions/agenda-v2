import Chip from './Chip';
import Input from './Input';
import Button from './Button';
import { useState } from 'react';
import styles from '../styles/ChipForm.module.css';

/**
 * Form for editing chip arrays
 * @param {Object} props
 * @param {Object[]} props.items - array of objects displayed in chips
 * @param {string} props.itemKey - key unique among chips (will be displayed)
 * @param {string} props.itemName - name of chips (tags, participants... )
 * @param {Function} props.setItems - function to overwrite parent's item array
 */
function ChipForm( props ) {
  const [ input, setInput ] = useState('');

  function addChip( chip ) {
    const keys = props.items.forEach( chip => chip[ props.itemKey ] );

    if ( keys && keys.includes( chip[ props.itemKey ] ) ) {
      throw new Error( `${ props.itemName } is not unique` );
    }

    props.setItems([ ...props.items, { [ props.itemKey ]: chip } ]);
  }

  function deleteChip( chipKey ) {
    const updatedChips = props.items.filter( item => {
      return chipKey !== item[ props.itemKey ];
    });

    props.setItems( updatedChips );
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

  props.items.forEach( ( chip ) => {
    const chipKey = chip[ props.itemKey ];

    chips.push(
      <Chip
        editing={true}
        text={chipKey}
        key={chipKey}
        deleteFunc={() => deleteChip( chipKey )}
      />
    );
  });

  return (
    <div>
      <p>{ props.itemName }s</p>
      <div className={styles.chipContainer}>
        {chips}
      </div>
      <p>Add {props.itemName}</p>
      <div className={styles.inputContainer}>
        <Input
          placeholder={props.itemKey}
          value={input}
          onChange={handleChange}
          onKeyPress={handleEnter}
        />
        <Button
          varient='secondary'
          name="submit"
          onClick={handleSubmit}
          text="add"
          className={styles.addButton}
        />
      </div>
    </div>
  );
}

export default ChipForm;
