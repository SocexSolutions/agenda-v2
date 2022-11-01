import HeaderForm from "../../../components/pages/Edit/HeaderForm/HeaderForm";
import StatusButton from "../../../components/pages/Edit/StatusButton/StatusButton";
import CardBoard from "../../../components/shared/CardBoard/CardBoard";
import ChipForm from "../../../components/shared/ChipForm/ChipForm";
import CardForm from "../../../components/shared/CardForm/CardForm";
import LoadingIcon from "../../../components/shared/LoadingIcon/LoadingIcon";

import { Fade } from "@mui/material";

import meetingAPI from "../../../api/meeting";
import participantAPI from "../../../api/participant";

import meetingStore from "../../../store/features/meeting";
import topicStore from "../../../store/features/topic";

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
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!initialized && meeting_id) {
      dispatch(meetingStore.actions.get(meeting_id));
      setInitialized(true);
    }

    if (meeting) {
      setName(meeting.name);
      setDate(meeting.date);
      setStatus(meeting.status);
    }
  }, [meeting, props.store, router.query.id]);

  const updateMeeting = ({ name, date }) => {
    dispatch(meetingStore.actions.update({ name, date, _id: meeting_id }));

    setName(name);
    setDate(date);
  };

  const updateMeetingStatus = ({ status }) => {
    dispatch(meetingStore.actions.updateStatus(meeting_id, status));

    setStatus(status);
  };

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
          <section className={styles.header}>
            <h2 className={shared.page_title}>Edit Meeting: {name}</h2>
            <StatusButton
              status={status}
              setMeetingStatus={(status) => updateMeetingStatus({ status })}
            />
          </section>
          <section className={shared.card + " " + styles.section}>
            <h3 className={styles.card_title}>Meeting Details</h3>
            <HeaderForm
              meetingName={name}
              setMeetingName={(e) =>
                updateMeeting({ name: e.target.value, date })
              }
              meetingDate={date}
              setMeetingDate={(e) => updateMeeting({ name, date: e.$d })}
            />
          </section>
          <section className={shared.card + " " + styles.section}>
            <h3>Participants</h3>
            <ChipForm
              change={meeting_id}
              itemKey={"email"}
              itemName={"participant"}
              getAll={() => meetingAPI.getParticipants(meeting_id)}
              create={(payload) =>
                participantAPI.create({
                  meeting_id,
                  ...payload,
                })
              }
              destroy={(id) => participantAPI.destroy(id)}
            />
          </section>
          <section
            className={
              shared.card + " " + styles.section + " " + styles.background
            }
          >
            <h3>Topics</h3>
            <CardBoard
              selector={(state) =>
                meetingStore.selectors.topics(state, meeting_id)
              }
              getAll={() =>
                dispatch(meetingStore.actions.getTopics(meeting_id))
              }
              create={(payload) =>
                dispatch(
                  topicStore.actions.create({
                    meeting_id,
                    ...payload,
                  })
                )
              }
              update={(item) => dispatch(topicStore.actions.update(item))}
              destroy={(item) => dispatch(topicStore.actions.delete(item))}
              Card={CardForm}
              itemName={"Action Item"}
            />
          </section>
        </div>
      </div>
    </Fade>
  );
};

export default Meeting;
