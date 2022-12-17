import HeaderForm from "../../../components/pages/Edit/HeaderForm/HeaderForm";
import MeetingHeader from "../../../components/shared/MeetingHeader/MeetingHeader";
import ChipForm from "../../../components/shared/ChipForm/ChipForm";
import LoadingIcon from "../../../components/shared/LoadingIcon/LoadingIcon";
import TopicBoard from "../../../components/pages/Edit/TopicBoard/TopicBoard";

import { Fade } from "@mui/material";

import meetingStore from "../../../store/features/meeting";
import participantStore from "../../../store/features/participant";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import styles from "../../../styles/pages/meeting/[id]/edit.module.scss";
import shared from "../../../styles/Shared.module.css";

const Meeting = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const meeting_id = router.query.id;

  const meeting = useSelector((state) =>
    meetingStore.selectors.get(state, meeting_id)
  );

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized && meeting_id) {
      dispatch(meetingStore.actions.get(meeting_id));
      dispatch(meetingStore.actions.getParticipants(meeting_id));
      dispatch(meetingStore.actions.getTopics(meeting_id));

      setInitialized(true);
    }
  }, [meeting, props.store, router.query.id]);

  const loading = !meeting || !meeting_id;

  if (loading) {
    return (
      <div className={styles.blank_container}>
        <LoadingIcon />
      </div>
    );
  }

  return (
    <Fade in={initialized}>
      <div className={shared.page}>
        <div className={styles.container}>
          <MeetingHeader meeting={meeting}>
            <h2 className={shared.page_title}>Edit: {meeting.name}</h2>
          </MeetingHeader>
          <section className={shared.card + " " + styles.section}>
            <h3 className={styles.card_title}>Meeting Details</h3>
            <HeaderForm meetingId={meeting_id} />
          </section>
          <section className={shared.card + " " + styles.section}>
            <h3>Participants</h3>
            <ChipForm
              selector={(state) =>
                meetingStore.selectors.participants(state, meeting_id)
              }
              itemKey={"email"}
              itemName={"participant"}
              validate={(key) => {
                // eslint-disable-next-line
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(key);
              }}
              validateMsg={"Invalid email address."}
              create={(item) =>
                dispatch(
                  participantStore.actions.create({
                    meeting_id,
                    ...item,
                  })
                )
              }
              destroy={(item) =>
                dispatch(participantStore.actions.delete(item))
              }
            />
          </section>
          <section
            className={
              shared.card + " " + styles.section + " " + styles.background
            }
          >
            <h3>Topics</h3>
            <TopicBoard
              meetingId={meeting_id}
              className={styles.topic_board_container}
            />
          </section>
        </div>
      </div>
    </Fade>
  );
};

export default Meeting;
