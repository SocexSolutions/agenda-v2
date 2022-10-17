import CardBoard from '../../../shared/CardBoard/CardBoard';
import CardForm from '../../../shared/CardForm/CardForm';

import topicAPI from '../../../../api/topic';
import actionItemAPI from '../../../../api/action-item';

export default function ActionItemBoard({ liveTopic, meetingId, hidden }) {
  return (
    <div hidden={hidden}>
      <CardBoard
        change={liveTopic._id}
        getAll={() => topicAPI.getActionItems( liveTopic._id )}
        create={( payload ) =>
          actionItemAPI.create({
            topic_id: liveTopic._id,
            meeting_id: meetingId,
            ...payload
          })
        }
        update={( id, payload ) => actionItemAPI.update( id, payload )}
        destroy={( id ) => actionItemAPI.destroy( id )}
        Card={CardForm}
        itemName={'Action Item'}
      />
    </div>
  );
}
