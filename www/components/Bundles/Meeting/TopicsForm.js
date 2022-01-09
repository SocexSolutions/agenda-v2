import styles from '../../../styles/Bundles/Meeting/TopicsForm.module.css';
import ChipForm from '../../ChipForm';

function TopicsForm( props ) {
  return (
    <div className={styles.container}>
      <h2>Topics</h2>
      <ChipForm
        items={props.topics}
        setItems={props.setTopics}
        itemKey='name'
        itemName='Topic'
      />
    </div>
  );
}

export default TopicsForm;
