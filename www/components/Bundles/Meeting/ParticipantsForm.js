import styles from '../../../styles/Bundles/Meeting/ParticipantsForm.module.css';

import Chip from '../../Chip';
import ChipForm from '../../ChipForm';

function ParticipantsForm( props ) {
  return (
    <div className={styles.container}>
      <h2>Participants</h2>
      <p>Owner</p>
      <Chip text={props.owner} icon={true} />
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
