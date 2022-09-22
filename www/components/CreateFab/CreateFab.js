import { useRouter } from 'next/router';
import meetingAPI from '../../api/meeting';
import Fab from '../Fab/Fab';
import AddIcon from '@mui/icons-material/Add';
export default function CreateFAB() {
  const router = useRouter();

  const createMeeting = async() => {
    // create a draft meeting before redirect so that created participants
    // and topics have a meeting_id to reference
    const res = await meetingAPI.create({ name: 'Draft', date: new Date() });

    router.push( `/meeting/${ res._id }` );
  };

  return (
    <Fab
      color="primary"
      variant="contained"
      size="large"
      startIcon={<AddIcon />}
      onClick={() => createMeeting()}
    >
      Create
    </Fab>
  );
}
