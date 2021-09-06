import Participant from "../components/Participant";
import MeetingNameDate from "../components/MeetingNameDate";
import MeetingTopics from "../components/MeetingTopics";
import Attendies from "../components/Attendies";

function meeting() {
  return (
    <div>
      <MeetingNameDate />
      <MeetingTopics />
      <Attendies />
    </div>
  );
}

export default meeting;
