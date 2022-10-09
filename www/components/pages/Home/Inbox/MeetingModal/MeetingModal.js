import { Modal, IconButton, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/router';
import MeetingAPI from '../../../../../api/meeting';
import styles from './MeetingModal.module.scss';

export default function MeetingModal({ meeting, open, setOpen }) {
  const router = useRouter();

  const displayDate = new Date( meeting.date ).toLocaleDateString();

  const onDelete = async() => {
    if (
      window.confirm(
        'Are you sure you want to delete this meeting.' +
        'This action cannot be undone. The meeting will no longer be visible ' +
        'to anyone.'
      )
    ) {
      await MeetingAPI.destroy( meeting._id );
    }
  };

  return (
    <Modal open={open} onClose={() => setOpen( false )}>
      <div className={styles.modal_container}>
        <div className={styles.header}>
          <div>
            <h2>{meeting.name}</h2>
            <p className={styles.display_date}>{displayDate}</p>
          </div>
          <div className={styles.actions_container}>
            <IconButton
              onClick={() => router.push( `/meeting/${ meeting._id }/edit` )}
            >
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => onDelete()}>
              <DeleteIcon />
            </IconButton>
            <IconButton onClick={() => setOpen( false )}>
              <CloseIcon />
            </IconButton>
          </div>
        </div>
        <div className={styles.footer}>
          <Button
            color="blue"
            variant="contained"
            disableElevation
            onClick={() => router.push( `/meeting/${ meeting._id }/meet` )}
          >
            Start
          </Button>
          <Button
            color="primary"
            variant="text"
            onClick={() => router.push( `/meeting/${ meeting._id }/vote` )}
          >
            Check Voting
          </Button>
        </div>
      </div>
    </Modal>
  );
}
