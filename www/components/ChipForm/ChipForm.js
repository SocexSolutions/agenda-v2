import { useStore } from '../../store';
import { notify }   from '../../store/features/snackbar';

import AddCircleIcon from '@mui/icons-material/AddCircle';

import Chip          from '../Chip/Chip';
import IconTextField from '../IconTextField/IconTextField';

import { useEffect, useState } from 'react';

import styles from './ChipForm.module.css';

/**
 * Form for editing chip arrays
 *
 * @param {String} change - key used to tell if form should reload
 * @param {String} itemKey - key unique among chips that will be displayed
 * @param {String} itemName - singular type of items (eg. participant)
 * @param {Function} getAll - async function to fetch all items that should be
 * displayed in the form
 * @param {Function} create - async function to create a new item in the form
 * given a `payload` as a param
 * @param {Function} destroy - async function to delete an item in the form
 * given an `id` as a param
 */
function ChipForm( props ) {
  const store = useStore();

  const [ input, setInput ]       = useState('');
  const [ items, setItems ]       = useState([]);
  const [ initLoad, setInitLoad ] = useState( true );

  useEffect( () => {
    const loadItems = async() => {
      const res = await props.getAll();
      setItems( res );

      setInitLoad( false );
    };

    // check that the change prop exists before attempting to load since we
    // know the component is dependant on it
    if ( initLoad && props.change ) {
      loadItems();
    }
  });

  const createChip = async( key ) => {
    const duplicates = items.filter( item => {
      return item[ props.itemKey ] === key;
    });

    if ( duplicates.length ) {
      store.dispatch( notify({
        message: `${ props.itemName }s with duplicate ${ props.itemKey }s`,
        type: 'danger'
      }) );

      return;
    }

    const res = await props.create({ [ props.itemKey ]: key });

    items.unshift( res );
    setItems([ ...items ]);
  };

  function destroyChip( index ) {
    const [ toDelete ] = items.splice( index, 1 );
    setItems([ ...items ]);

    props.destroy( toDelete._id );
  }

  function handleEnter( event ) {
    if ( event.key === 'Enter' ) {
      handleSubmit();
    }
  }

  function handleSubmit() {
    if ( input ) {
      createChip( input );
      setInput('');
    }
  }

  const chips = [];

  if ( items?.length ) {
    for ( let i = 0; i < items.length; i++ ) {
      const item = items[ i ];

      chips.push(
        <Chip
          index={i}
          editing={true}
          text={item[ props.itemKey ]}
          key={item[ props.itemKey ]}
          deleteFunc={() => destroyChip( i )}
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
        <IconTextField
          label={`Add ${ props.itemName }`}
          value={input}
          onChange={( e ) => setInput( e.target.value )}
          onKeyPress={handleEnter}
          size="small"
          Icon={AddCircleIcon}
          onIconClick={handleSubmit}
        />
      </div>
    </div>
  );
}

export default ChipForm;
