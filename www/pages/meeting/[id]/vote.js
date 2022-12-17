import LoadingIcon from "../../../components/shared/LoadingIcon/LoadingIcon";
import TopicBoard from "../../../components/pages/Edit/TopicBoard/TopicBoard";

import styles from "../../../styles/pages/meeting/[id]/vote.module.scss";
import shared from "../../../styles/Shared.module.css";

import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { calcUserLikes, calcMaxLikes } from "../../../utils/topic-likes";

import { selectUser } from "../../../store/features/user";
import meetingStore from "../../../store/features/meeting";

const Vote = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [initialized, setInitialized] = useState(false);

  const meeting_id = router.query.id;

  const user = useSelector(selectUser);
  const meeting = useSelector((state) =>
    meetingStore.selectors.get(state, meeting_id)
  );
  const topics = useSelector((state) =>
    meetingStore.selectors.topics(state, meeting_id)
  );

  const loading = !meeting || !topics || !user;

  useEffect(() => {
    if (!initialized && meeting_id) {
      dispatch(meetingStore.actions.get(meeting_id));
      dispatch(meetingStore.actions.getTopics(meeting_id));
      setInitialized(true);
    }
  }, [user, meeting_id, initialized, dispatch]);

  if (loading) {
    return (
      <div className={styles.blank_container}>
        <LoadingIcon />
      </div>
    );
  }

  const userLikes = calcUserLikes(topics, user);
  const maxLikes = calcMaxLikes(topics);

  return (
    <div className={shared.page}>
      <div className={shared.container}>
        <h2>Voting For: {meeting.name}</h2>
        <div className={styles.topic_grid}>
          <TopicBoard meetingId={meeting._id} showLike={true} />

          <div
            className={`${styles.vote_count} ${shared.card} ${
              userLikes > maxLikes && styles.max_votes
            }`}
          >
            <h2>
              {userLikes} of {Math.floor(topics.length / 2) + 1}
            </h2>
            <p>Votes used</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vote;
