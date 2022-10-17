import CardBoard from '../../../shared/CardBoard/CardBoard';
import CardForm from '../../../shared/CardForm/CardForm';

import topicAPI from '../../../../api/topic';
import takeawayAPI from '../../../../api/takeaway';

export default function ActionItemBoard({ liveTopic, meetingId, hidden }) {
  return (
    <div hidden={hidden}>
      <CardBoard
        change={liveTopic._id}
        getAll={() => topicAPI.getTakeaways( liveTopic._id )}
        create={( payload ) =>
          takeawayAPI.create({
            topic_id: liveTopic._id,
            meeting_id: meetingId,
            ...payload
          })
        }
        update={( id, payload ) => takeawayAPI.update( id, payload )}
        destroy={( id ) => takeawayAPI.destroy( id )}
        Card={CardForm}
        itemName={'Takeaway'}
      />
    </div>
  );
}
