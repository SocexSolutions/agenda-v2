import styles from '../../../styles/Bundles/Meeting/TopicsForm.module.css';

import { useState } from 'react';

import Input  from '../../Input';
import Button from '../../Button';

import TopicCard from './TopicCard';

function TopicsForm( props ) {
  const [ name, setName ]               = useState('');
  const [ description, setDescription ] = useState('');

  const clearForm = () => {
    setName('');
    setDescription('');
  };

  const addTopic = () => {
    const updatedTopics = [ ...props.topics ];

    updatedTopics.unshift({ name, description });

    props.setTopics( updatedTopics );

    clearForm();
  };

  const updateTopic = ( index, updated ) => {
    const updatedTopics = [ ...props.topics ];

    updatedTopics.splice( index, 1, updated );

    props.setTopics( updatedTopics );

    props.setTopics( updatedTopics );
  };

  const deleteTopic = ( index ) => {
    const updatedTopics = [ ...props.topics ];

    updatedTopics.splice( index, 1 );

    props.setTopics( updatedTopics );
  };

  const topicCards = [ ];

  if ( props.topics ) {
    for ( let i = 0; i < props.topics.length; i++ ) {
      const topic = props.topics[ i ];
      topicCards.push(
        <TopicCard
          key={topic.name + ' ' + topic.description}
          index={i}
          topic={topic}
          updateTopic={updateTopic}
          deleteTopic={deleteTopic}
        />
      );
    }
  }

  return (
    <div>
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
          text='add'
          size='medium'
          onClick={() => addTopic()}
        />
      </div>
      { topicCards }
    </div>
  );
}

export default TopicsForm;
