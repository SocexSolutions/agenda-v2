import styles from '../../../styles/Bundles/Meeting/ParticipantsForm.module.css';

import Chip from '../../Chip';
import ChipForm from '../../ChipForm';

function ParticipantsForm( props ) {
  return (
    <div className={styles.container}>
      <h3>Owner</h3>
      <Chip
        text={props.owner}
        icon={true}
      />
      <br/>
      <ChipForm
        items={props.participants}
        itemKey='email'
        itemName='Participant'
        setItems={props.setParticipants}
      />
    </div>
  );
}

export default ParticipantsForm;
