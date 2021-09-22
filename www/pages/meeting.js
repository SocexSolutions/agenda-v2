import { Component } from "react";
import MeetingNameDate from "../components/MeetingNameDate";
import MeetingTopics from "../components/MeetingTopics";
import Attendies from "../components/Attendies";

class Meeting extends Component {
  constructor( props ) {
    super( props );

    this.state = {
      meeting: {},
      topics: [],
      owner: "Tom Hudson",
      participants: [ "David Oligney", "Zach Barnes" ],
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
    const newParticipant = this.attendies;

    newParticipant.push( participant );

    this.setState({ ...this.state, attendies: newParticipant });
  }

  deleteParticipant( deleteParticipant ) {
    const newParticipants = this.topics.filter( ( participant ) => {
      return participant === deleteParticipant;
    });

    this.setState({ ...this.state, participant: newParticipants });
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
        <Attendies
          owner={this.state.owner}
          participants={this.state.participants}
          addParticipant={this.addParticipant}
          deleteParticipant={this.deleteParticipant}
        />
      </div>
    );
  }
}

export default Meeting;
