import TopicSelectBar from "../../../components/pages/Meet/TopicSelectBar/TopicSelectBar";
import ActionItemBar from "../../../components/pages/Meet/ActionItemBar/ActionItemBar";
import TopicDisplay from "../../../components/pages/Meet/TopicDisplay/TopicDisplay";
import TakeawayBoard from "../../../components/pages/Meet/TakeawayBoard/TakeawayBoard";
import ActionItemBoard from "../../../components/pages/Meet/ActionItemBoard/ActionItemBoard";

import meetingAPI from "../../../api/meeting";
import topicAPI from "../../../api/topic";

import { ToggleButtonGroup } from "@mui/material";
import { ToggleButton } from "@mui/material";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

import styles from "../../../styles/pages/meeting/[id]/meet.module.scss";
import shared from "../../../styles/Shared.module.css";

export default function MeetRevamp() {
  const router = useRouter();
  const user = useSelector((state) => state.user);

  const meeting_id = router.query.id;

  const [tab, setTab] = useState("Takeaways");
  const [name, setName] = useState("");
  const [topics, setTopics] = useState([]);

  const changeTab = (t) => {
    if (!t) {
      return;
    }

    setTab(t);
  };

  const loadMeeting = async (meeting_id) => {
    const meeting = await meetingAPI.get(meeting_id);

    setName(meeting.name);
  };

  const loadTopics = async (meeting_id) => {
    const res = await meetingAPI.getTopics(meeting_id);

    setTopics(res);
  };

  const switchToTopic = async (topic_id) => {
    await topicAPI.switch(topic_id);

    loadTopics(meeting_id);
  };

  const closeTopic = async (topic_id) => {
    await topicAPI.close(topic_id);

    loadTopics(meeting_id);
  };

  useEffect(() => {
    if (meeting_id) {
      loadMeeting(meeting_id);
      loadTopics(meeting_id);
    }
  }, [user, meeting_id]);

  const liveTopic = topics.find((topic) => topic.status === "live");

  return (
    <div className={shared.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Meet: {name}</h2>
        </div>
        <div className={styles.main_grid}>
          <div>
            <TopicSelectBar
              meetingName={name}
              topics={topics}
              switchToTopic={switchToTopic}
            />
          </div>
          <div>
            {liveTopic ? (
              <TopicDisplay topic={liveTopic} closeTopic={closeTopic} />
            ) : (
              <p>No topic selected. Select a topic on the left to begin.</p>
            )}
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
                  <ToggleButton value="Action Items">Action Items</ToggleButton>
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
  );
}
