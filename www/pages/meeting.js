import { Component } from "react";
import MeetingNameDate from "../components/MeetingNameDate";
import MeetingTopics from "../components/MeetingTopics";
import MeetingParticipants from "../components/MeetingParticipants";
import Button from "../components/Button";
class Meeting extends Component {
  constructor( props ) {
    super( props );

    this.state = {
      meeting: {},
      topics: [],
      owner: "Tom Hudson",
      participants: [],
      editing: true,
    };

    this.addTopic = this.addTopic.bind( this );
    this.deleteTopic = this.deleteTopic.bind( this );
    this.setMeetingName = this.setMeetingName.bind( this );
    this.setMeetingDate = this.setMeetingDate.bind( this );
    this.addParticipant = this.addParticipant.bind( this );
    this.deleteParticipant = this.deleteParticipant.bind( this );
    this.setImportance = this.setImportance.bind( this );
  }

  addTopic( topicName ) {
    const newTopics = this.state.topics;

    if ( newTopics.includes( topicName ) ) {
      return;
    }

    newTopics.push( topicName );

    this.setState({ ...this.state, topics: newTopics });
  }

  deleteTopic( deleteTopic ) {
    const newTopics = this.state.topics.filter( ( topic ) => {
      return topic !== deleteTopic;
    });

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

    if ( newParticipants.includes( participant ) ) {
      return;
    }

    newParticipants.push( participant );

    this.setState({ ...this.state, participants: newParticipants });
  }

  deleteParticipant( deleteParticipant ) {
    const newParticipants = this.state.participants.filter( ( participant ) => {
      return participant !== deleteParticipant;
    });

    this.setState({ ...this.state, participants: newParticipants });
  }

  setImportance( event ) {
    this.setState({
      ...this.state,
      meeting: { ...this.meeting, importance: event.target.value },
    });
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
        <Button text="submit" />
      </div>
    );
  }
}

export default Meeting;
