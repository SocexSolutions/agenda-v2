import TopicSelectBar from "../../../components/pages/Meet/TopicSelectBar/TopicSelectBar";
import ActionItemBar from "../../../components/pages/Meet/ActionItemBar/ActionItemBar";
import TopicDisplay from "../../../components/pages/Meet/TopicDisplay/TopicDisplay";
import Board from "../../../components/pages/Meet/Board/Board";
import LoadingIcon from "../../../components/shared/LoadingIcon/LoadingIcon";

import { Fade } from "@mui/material";
import { Button } from "@mui/material";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";

import meetingStore from "../../../store/features/meeting";
import topicStore from "../../../store/features/topic";

import styles from "../../../styles/pages/meeting/[id]/meet.module.scss";
import shared from "../../../styles/Shared.module.css";

export default function Meet() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const meeting_id = router.query.id;

  const meeting = useSelector((state) =>
    meetingStore.selectors.get(state, meeting_id)
  );
  const topics = useSelector((state) =>
    meetingStore.selectors.topics(state, meeting_id)
  );

  useEffect(() => {
    if (meeting_id) {
      dispatch(meetingStore.actions.get(meeting_id));
      dispatch(meetingStore.actions.getParticipants(meeting_id));
      dispatch(meetingStore.actions.getTopics(meeting_id));
      dispatch(meetingStore.actions.getActionItems(meeting_id));
    }

    const interval = setInterval(() => {
      dispatch(meetingStore.actions.getTopics(meeting_id));
      dispatch(meetingStore.actions.getActionItems(meeting_id));
    }, 2000 + Math.random() * 1000);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [meeting_id]);

  const [selectedId, setSelectedId] = useState();

  const closeTopic = async (topic) => {
    dispatch(topicStore.actions.close(topic));

    setSelectedId(null);
  };

  const reOpenTopic = async (topic) => {
    dispatch(topicStore.actions.reOpen(topic));
  };

  if (!meeting || !topics) {
    return (
      <div className={styles.blank_container}>
        <LoadingIcon />
      </div>
    );
  }

  const allDone = topics.every((topic) => topic.status === "closed");

  let topicDisplay = (
    <h3 className={styles.no_topic}>Select a topic on the left.</h3>
  );

  const selectedTopic = topics.find((t) => t._id === selectedId);

  if (allDone && !selectedTopic && meeting.status !== "completed") {
    topicDisplay = (
      <div className={styles.all_done}>
        <h3>
          Looks like you have discussed all topics, ready to complete the
          meeting?
        </h3>
        <Button
          variant="contained"
          className={styles.complete_button}
          onClick={() => {
            dispatch(
              meetingStore.actions.updateStatus(meeting._id, "completed")
            );
            router.push(`/user/${user._id}/home`);
          }}
        >
          Complete Meeting
        </Button>
      </div>
    );
  } else if (selectedTopic) {
    topicDisplay = (
      <TopicDisplay
        topic={selectedTopic}
        closeTopic={(t) => closeTopic(t)}
        reOpenTopic={(t) => reOpenTopic(t)}
        hideTopic={() => setSelectedId(null)}
      />
    );
  }

  return (
    <Fade in={true}>
      <div className={shared.page}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2>Meet: {meeting.name}</h2>
          </div>
          <div className={styles.main_grid}>
            <div>
              <TopicSelectBar
                meetingName={meeting.name}
                selectedTopic={selectedTopic}
                topics={topics}
                switchToTopic={(t) => setSelectedId(t._id)}
              />
            </div>
            <div>
              {topicDisplay}
              {selectedTopic && (
                <Board selectedTopic={selectedTopic} meetingId={meeting_id} />
              )}
            </div>
            <div>
              <ActionItemBar meetingId={meeting_id} />
            </div>
          </div>
        </div>
      </div>
    </Fade>
  );
}
