import styles from '../../../styles/Bundles/Meeting/DiscussionForm.module.css';
import Button from '../../../components/Button.js';

/**
 * 
 * @param {Object} topic - topic of the discussion
 * @param {Function} close - function to finish a topic
 * @returns
 */
const DiscussionForm = ({ topic, close }) => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.title}>{topic.name}</div>
        <Button
          text="close"
          onClick={close}
        />
      </div>
    </>
  );
};

export default DiscussionForm;
