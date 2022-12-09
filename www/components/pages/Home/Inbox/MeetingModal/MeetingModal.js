import { Modal, IconButton, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";

import meetingAPI from "../../../../../api/meeting";
import meetingStore from "../../../../../store/features/meeting";
import { useStore } from "../../../../../store";

import styles from "./MeetingModal.module.scss";

/**
 * A modal the provides a brief overview of a meeting
 * @param {Object} meetingId - a meeting
 * @param {boolean} open - whether the meeting modal is open
 * @param {Function} onClose - set function for `open`
 * @param {Function} refresh - tell the home page to refresh meetings
 */
export default function MeetingModal({ meeting, open, onClose, refresh }) {
  const router = useRouter();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const store = useStore();

  if (!meeting) return null;

  const isOwner = meeting.owner._id === user._id;

  const displayDate = new Date(meeting.date).toLocaleDateString();

  const onDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this meeting." +
          "This action cannot be undone. The meeting will no longer be visible " +
          "to anyone."
      )
    ) {
      await meetingAPI.destroy(meeting._id);

      refresh();

      onClose();
    }
  };

  const onSend = async () => {
    await store.dispatch(
      meetingStore.actions.updateStatus(meeting._id, "sent")
    );

    await refresh();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className={styles.modal_container}>
        <div className={styles.header}>
          <div>
            <h2>{meeting.name}</h2>
            <p className={styles.display_date}>{displayDate}</p>
            {meeting.purpose && <p>{meeting.purpose}</p>}
          </div>
          <div className={styles.actions_container}>
            {isOwner && (
              <IconButton
                onClick={() => router.push(`/meeting/${meeting._id}/edit`)}
              >
                <EditIcon />
              </IconButton>
            )}
            {isOwner && (
              <IconButton onClick={onDelete}>
                <DeleteIcon />
              </IconButton>
            )}
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </div>
        </div>

        <div className={styles.footer}>
          {isOwner &&
            (meeting.status === "sent" || meeting.status === "draft") && (
              <Button
                color="blue"
                variant="contained"
                onClick={() => {
                  dispatch(
                    meetingStore.actions.updateStatus(meeting._id, "live")
                  );
                  router.push(`/meeting/${meeting._id}/meet`);
                }}
              >
                Meet
              </Button>
            )}
          {meeting.status === "completed" && (
            <Button
              color="primary"
              variant="contained"
              onClick={() => router.push(`/meeting/${meeting._id}/meet`)}
            >
              View Results
            </Button>
          )}
          {meeting.status === "live" && (
            <Button
              color="blue"
              variant="contained"
              onClick={() => router.push(`/meeting/${meeting._id}/meet`)}
            >
              Join
            </Button>
          )}
          {isOwner && meeting.status !== "draft" && (
            <Button
              color="primary"
              variant="text"
              onClick={() => router.push(`/meeting/${meeting._id}/vote`)}
            >
              View Voting
            </Button>
          )}
          {isOwner && meeting.status === "draft" && (
            <Button color="green" variant="contained" onClick={onSend}>
              Send
            </Button>
          )}
          {!isOwner && meeting.status === "sent" && (
            <Button
              color="green"
              variant="contained"
              onClick={() => router.push(`/meeting/${meeting._id}/vote`)}
            >
              Vote
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
