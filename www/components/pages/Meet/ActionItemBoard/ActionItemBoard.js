import CardBoard from "../../../shared/CardBoard/CardBoard";
import CardForm from "../../../shared/CardForm/CardForm";

import topicStore from "../../../../store/features/topic";
import actionItemStore from "../../../../store/features/action-item";

import { useEffect } from "react";

import { useDispatch } from "react-redux";

export default function ActionItemBoard({ liveTopic, meetingId, hidden }) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (liveTopic) {
      dispatch(topicStore.actions.getActionItems(liveTopic._id));
    }
  }, [dispatch]);

  return (
    <div hidden={hidden}>
      <CardBoard
        selector={(state) =>
          topicStore.selectors.actionItems(state, liveTopic._id)
        }
        create={(payload) =>
          dispatch(
            actionItemStore.actions.create({
              topic_id: liveTopic._id,
              meeting_id: meetingId,
              ...payload,
            })
          )
        }
        update={(item) => dispatch(actionItemStore.actions.update(item))}
        destroy={(item) => dispatch(actionItemStore.actions.delete(item))}
        Card={CardForm}
        itemName={"Action Item"}
      />
    </div>
  );
}
