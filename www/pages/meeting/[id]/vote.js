import LoadingIcon from "../../../components/shared/LoadingIcon/LoadingIcon";
import Button from "../../../components/shared/Button/Button";

import ThumbsUpIcon from "@mui/icons-material/ThumbUp";

import styles from "../../../styles/pages/meeting/[id]/vote.module.scss";
import shared from "../../../styles/Shared.module.css";

import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { notify } from "../../../store/features/snackbar";
import { selectUser } from "../../../store/features/user";
import meetingStore from "../../../store/features/meeting";
import topicStore from "../../../store/features/topic";

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

  const userLikes = topics.reduce((acc, t) => {
    if (t.likes.includes(user.email)) {
      acc++;
    }

    return acc;
  }, 0);

  const maxLikes = Math.floor(topics.length / 2);

  const onLike = (topic) => {
    if (userLikes > maxLikes && !topic.likes.includes(user.email)) {
      dispatch(
        notify({
          type: "danger",
          message: "You are out of votes.",
        })
      );
      return;
    }

    dispatch(topicStore.actions.like(topic));
  };

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

  const topicCards = topics.map((t) => {
    const liked = t.likes.includes(user.email);
    const classNames = liked ? styles.dislike : styles.like;

    return (
      <div className={shared.card + " " + styles.topic} key={t.name}>
        <h3>{t.name}</h3>
        <p>{t.description}</p>
        <Button
          className={styles.like}
          variant="icon"
          icon={
            <ThumbsUpIcon
              fontSize="large"
              className={classNames}
              onClick={() => onLike(t)}
            />
          }
        />
      </div>
    );
  });

  return (
    <div className={shared.page}>
      <div className={shared.container}>
        <h2>Voting For: {meeting.name}</h2>
        <div className={styles.topic_grid}>
          <div>{topicCards}</div>

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
