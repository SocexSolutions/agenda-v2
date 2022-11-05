import TopicSelectBar from "../../../components/pages/Meet/TopicSelectBar/TopicSelectBar";
import ActionItemBar from "../../../components/pages/Meet/ActionItemBar/ActionItemBar";
import TopicDisplay from "../../../components/pages/Meet/TopicDisplay/TopicDisplay";
import TakeawayBoard from "../../../components/pages/Meet/TakeawayBoard/TakeawayBoard";
import ActionItemBoard from "../../../components/pages/Meet/ActionItemBoard/ActionItemBoard";
import LoadingIcon from "../../../components/shared/LoadingIcon/LoadingIcon";

import { ToggleButtonGroup } from "@mui/material";
import { ToggleButton } from "@mui/material";
import { Button } from "@mui/material";
import { Fade } from "@mui/material";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";

import meetingStore from "../../../store/features/meeting";
import topicStore from "../../../store/features/topic";

import styles from "../../../styles/pages/meeting/[id]/meet.module.scss";
import shared from "../../../styles/Shared.module.css";

export default function MeetRevamp() {
  const router = useRouter();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const meeting_id = router.query.id;

  const meeting = useSelector((state) =>
    meetingStore.selectors.get(state, meeting_id)
  );
  const topics = useSelector((state) =>
    meetingStore.selectors.topics(state, meeting_id)
  );

  const [initialized, setInitialized] = useState(false);
  const [tab, setTab] = useState("Takeaways");

  const changeTab = (t) => {
    if (!t) {
      return;
    }

    setTab(t);
  };

  useEffect(() => {
    if (!initialized && meeting_id) {
      dispatch(meetingStore.actions.get(meeting_id));
      dispatch(meetingStore.actions.getTopics(meeting_id));
      setInitialized(true);
    }
  }, [user, meeting_id, initialized, dispatch]);

  const liveTopic = topics.find((topic) => topic.status === "live");
  const allDone = topics.every((t) => t.status === "closed");

  if (!meeting || !topics) {
    return (
      <div className={styles.blank_container}>
        <LoadingIcon />
      </div>
    );
  }

  let topicDisplay = (
    <p>No topic selected. Select a topic on the left to begin.</p>
  );

  if (allDone) {
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
  } else if (liveTopic) {
    topicDisplay = (
      <TopicDisplay
        topic={liveTopic}
        closeTopic={(t) => dispatch(topicStore.actions.close(t))}
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
                topics={topics}
                switchToTopic={(t) => dispatch(topicStore.actions.switch(t))}
              />
            </div>
            <div>
              {topicDisplay}
              {liveTopic && (
                <div className={styles.tabs_container}>
                  <ToggleButtonGroup
                    className={styles.button_group}
                    size="small"
                    color="primary"
                    value={tab}
                    exclusive
                    onChange={(_, ta) => changeTab(ta)}
                  >
                    <ToggleButton value="Takeaways">Takeaways</ToggleButton>
                    <ToggleButton value="Action Items">
                      Action Items
                    </ToggleButton>
                  </ToggleButtonGroup>
                  <TakeawayBoard
                    hidden={tab !== "Takeaways"}
                    liveTopic={liveTopic}
                    meetingId={meeting_id}
                  />
                  <ActionItemBoard
                    hidden={tab !== "Action Items"}
                    liveTopic={liveTopic}
                    meetingId={meeting_id}
                  />
                </div>
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
