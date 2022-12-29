import TopicSelectBar from "../../../components/pages/Meet/TopicSelectBar/TopicSelectBar";
import ActionItemBar from "../../../components/pages/Meet/ActionItemBar/ActionItemBar";
import TopicDisplay from "../../../components/pages/Meet/TopicDisplay/TopicDisplay";
import Board from "../../../components/pages/Meet/Board/Board";
import LoadingIcon from "../../../components/shared/LoadingIcon/LoadingIcon";
import MeetingHeader from "../../../components/shared/MeetingHeader/MeetingHeader";

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

  const allTopicsDiscussed = topics.every((topic) => topic.status === "closed");

  const selectedTopic = topics.find((t) => t._id === selectedId);
  const sortedTopics = topics.sort((a, b) => b.likes.length - a.likes.length);
  const meetingStarted =
    meeting.status === "live" || meeting.status === "completed";

  const noLikedTopics = sortedTopics[0] && sortedTopics[0].likes.length === 0;

  let topicDisplay = (
    <div className={styles.instructions}>
      <h3>Select a topic on the left to discuss.</h3>
    </div>
  );

  if (!topics.length) {
    topicDisplay = (
      <div className={styles.instructions}>
        <h3>Looks like there are no topics for this meeting.</h3>
        <Button
          variant="contained"
          className={styles.instructions_button}
          color="green"
          onClick={() => router.push(`/meeting/${meeting._id}/vote`)}
        >
          Add Topics
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
  } else if (!meetingStarted && noLikedTopics) {
    topicDisplay = (
      <div className={styles.instructions}>
        <h3>
          Looks like no votes have been cast. Do you still want to meet?
        </h3>
        <div className={styles.instructions_button_container}>
          <Button
            variant="contained"
            className={styles.instructions_button}
            color="green"
            onClick={() => router.push(`/meeting/${meeting._id}/vote`)}
          >
            Vote
          </Button>
          <Button
            variant="contained"
            className={styles.instructions_button}
            color="blue"
            onClick={() => {
              dispatch(meetingStore.actions.updateStatus(meeting._id, "live"));
              if (sortedTopics.length > 0) {
                setSelectedId(sortedTopics[0]._id);
              }
            }}
          >
            Meet
          </Button>
        </div>
      </div>
    );
  } else if (!meetingStarted) {
    topicDisplay = (
      <div className={styles.instructions}>
        <h3>Ready to meet?</h3>
        <Button
          variant="contained"
          className={styles.instructions_button}
          color="blue"
          onClick={() => {
            dispatch(meetingStore.actions.updateStatus(meeting._id, "live"));
            if (sortedTopics.length > 0) {
              setSelectedId(sortedTopics[0]._id);
            }
          }}
        >
          Meet
        </Button>
      </div>
    );
  } else if (allTopicsDiscussed && meeting.status !== "completed") {
    topicDisplay = (
      <div className={styles.instructions}>
        <h3>
          Looks like you have discussed all topics, ready to complete the
          meeting?
        </h3>
        <Button
          variant="contained"
          className={styles.instructions_button}
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
  }

  return (
    <Fade in={true}>
      <div className={shared.page}>
        <div className={styles.container}>
          <MeetingHeader meeting={meeting}>
            <h2>Meet: {meeting.name}</h2>
          </MeetingHeader>
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
