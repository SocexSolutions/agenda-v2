import LoadingIcon from "../../../components/shared/LoadingIcon/LoadingIcon";
import Button from "../../../components/shared/Button/Button";

import ThumbsUpIcon from "@mui/icons-material/ThumbUp";

import styles from "../../../styles/pages/meeting/[id]/voting.module.css";
import shared from "../../../styles/Shared.module.css";

import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { selectUser } from "../../../store/features/user";
import {
  getMeeting,
  getMeetingTopics,
  selectMeeting,
  selectMeetingTopics,
} from "../../../store/features/meeting";
import { like } from "../../../store/features/topic";

const Vote = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [initialized, setInitialized] = useState(false);

  const meeting_id = router.query.id;

  const user = useSelector(selectUser);
  const topics = useSelector((state) => selectMeetingTopics(state, meeting_id));
  const meeting = useSelector((state) => selectMeeting(state, meeting_id));

  const loading = !meeting || !topics || !user;

  const onLike = (topic) => {
    console.log("like", topic);
    dispatch(like(topic));
  };

  useEffect(() => {
    if (!initialized && meeting_id) {
      dispatch(getMeeting(meeting_id));
      dispatch(getMeetingTopics(meeting_id));
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
        {topicCards}
      </div>
    </div>
  );
};

export default Vote;
