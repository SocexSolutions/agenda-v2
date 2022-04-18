import styles from '../../../styles/Bundles/Meeting/ParticipantsForm.module.css';

import ChipForm from '../../ChipForm';

function ParticipantsForm( props ) {
  return (
    <div className={styles.container}>
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
