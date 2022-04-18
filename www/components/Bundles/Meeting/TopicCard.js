import styles from '../../../styles/Bundles/Meeting/TopicCard.module.css';

import Button from '../../Button';
import Input  from '../../Input';

import { useState } from 'react';

const TopicCard = ( props ) => {
  const [ editing, setEditing ]         = useState( false );
  const [ name, setName ]               = useState( props.topic.name );
  const [ description, setDescription ] = useState( props.topic.description );

  const onUpdate = () => {
    props.updateTopic( props.index, { ...props.topic, name, description } );
    setEditing( false );
  };

  if ( !editing ) {
    return (
      <div className={styles.container}>
        <h3>{name}</h3>
        <p>{description}</p>
        <div className={styles.buttonContainer}>
          <Button
            text='delete'
            size='medium'
            onClick={() => props.deleteTopic( props.index )}
          />
          <Button
            size='medium'
            text='edit'
            onClick={() => setEditing( true )}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Input
        size='50'
        placeholder='topic name'
        value={name}
        onChange={e => setName( e.target.value )}
      />
      <Input
        size='50'
        placeholder='topic description'
        value={description}
        multiLine={true}
        variant='outlined'
        customClass={styles.description}
        rows='3'
        onChange={e => setDescription( e.target.value )}
      />
      <Button
        text='save'
        size='medium'
        onClick={() => onUpdate()}
      />
    </div>
  );
};

export default TopicCard;
