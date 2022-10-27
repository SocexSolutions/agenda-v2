import CardBoard from "../../../shared/CardBoard/CardBoard";
import CardForm from "../../../shared/CardForm/CardForm";

import takeawayStore from "../../../../store/features/takeaway";
import topicStore from "../../../../store/features/topic";

import { useDispatch } from "react-redux";

export default function TakeawayBoard({ liveTopic, meetingId, hidden }) {
  const dispatch = useDispatch();

  return (
    <div hidden={hidden}>
      <CardBoard
        selector={(state) =>
          topicStore.selectors.takeaways(state, liveTopic._id)
        }
        getAll={() => dispatch(topicStore.actions.getTakeaways(liveTopic._id))}
        create={(payload) =>
          dispatch(
            takeawayStore.actions.create({
              topic_id: liveTopic._id,
              meeting_id: meetingId,
              ...payload,
            })
          )
        }
        update={(item) => dispatch(takeawayStore.actions.update(item))}
        destroy={(item) => dispatch(takeawayStore.actions.delete(item))}
        Card={CardForm}
        itemName={"Takeaway"}
      />
    </div>
  );
}
