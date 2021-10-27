import { Component } from "react";
import MeetingNameDate from "../components/MeetingNameDate";
import MeetingTopics from "../components/MeetingTopics";
import MeetingParticipants from "../components/MeetingParticipants";
import Button from "../components/Button";
import { saveMeeting } from "../store/features/meetings/meetingSlice";
class Meeting extends Component {
  constructor( props ) {
    super( props );

    const state = this.props.store.getState();

    this.state = {
      meeting: {},
      owner: state.user.email,
      topics: new Set(),
      participants: new Set(),
      editing: true,
    };

    this.addTopic = this.addTopic.bind( this );
    this.deleteTopic = this.deleteTopic.bind( this );
    this.setMeetingName = this.setMeetingName.bind( this );
    this.setMeetingDate = this.setMeetingDate.bind( this );
    this.addParticipant = this.addParticipant.bind( this );
    this.deleteParticipant = this.deleteParticipant.bind( this );
    this.setImportance = this.setImportance.bind( this );
    this.saveMeeting = this.saveMeeting.bind( this );
  }

  addTopic( topicName ) {
    const newTopics = this.state.topics;

    newTopics.add( topicName );

    this.setState({ ...this.state, topics: newTopics });
  }

  deleteTopic( deleteTopic ) {
    const newTopics = this.state.topics;

    newTopics.delete( deleteTopic );

    this.setState({ ...this.state, topics: newTopics });
  }

  setMeetingName( event ) {
    this.setState({
      ...this.state,
      meeting: { ...this.meeting, name: event.target.value },
    });
  }

  setMeetingDate( event ) {
    this.setState({
      ...this.state,
      meeting: { ...this.meeting, date: event.target.value },
    });
  }

  addParticipant( participant ) {
    const newParticipants = this.state.participants;

    newParticipants.add( participant );

    this.setState({ ...this.state, participants: newParticipants });
  }

  deleteParticipant( deleteParticipant ) {
    const newParticipants = this.state.participants;

    newParticipants.delete( deleteParticipant );

    this.setState({ ...this.state, participants: newParticipants });
  }

  setImportance( event ) {
    this.setState({
      ...this.state,
      meeting: { ...this.meeting, importance: event.target.value },
    });
  }

  saveMeeting() {
    this.store.dispatch(
      saveMeeting({
        meetingInfo: { ...this.state.meeting, owner: this.state.owner },
        topics: this.state.topics,
        participants: this.state.participants
      })
    );
  }

  render() {
    return (
      <div>
        <MeetingNameDate
          setImportance={this.setImportance}
          importance={this.state.importance}
          setMeetingName={this.setMeetingName}
          meetingName={this.state.meetingName}
          setMeetingDate={this.setMeetingDate}
          meetingDate={this.state.meetingDate}
        />
        <MeetingTopics
          topics={this.state.topics}
          addTopic={this.addTopic}
          deleteTopic={this.deleteTopic}
        />
        <MeetingParticipants
          owner={this.state.owner}
          participants={this.state.participants}
          addParticipant={this.addParticipant}
          deleteParticipant={this.deleteParticipant}
        />
        <Button onClick={this.saveMeeting} text="submit" />
      </div>
    );
  }
}

export default Meeting;
