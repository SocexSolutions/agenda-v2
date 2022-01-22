import { Component } from 'react';
import HeaderForm from '../components/Bundles/Meeting/HeaderForm';
import TopicsForm from '../components/Bundles/Meeting/TopicsForm';
import ParticipantsForm from '../components/Bundles/Meeting/ParticipantsForm';
import Button from '../components/Button';
import { saveMeeting } from '../store/features/meetings/meetingSlice';
import styles from '../styles/MeetingPage.module.css';

class Meeting extends Component {
  constructor( props ) {
    super( props );

    const state = this.props.store.getState();

    this.state = {
      name: '',
      date: new Date(),
      owner_id: state.user._id,
      topics: [],
      participants: [],
      editing: true
    };

    this.setParticipants = this.setParticipants.bind( this );
    this.setTopics = this.setTopics.bind( this );
    this.setMeetingName = this.setMeetingName.bind( this );
    this.setMeetingDate = this.setMeetingDate.bind( this );
    this.saveMeeting = this.saveMeeting.bind( this );
  }

  setTopics( topics ) {
    this.setState({
      ...this.state,
      topics
    });
  }

  setParticipants( participants ) {
    this.setState({
      ...this.state,
      participants
    });
  }

  setMeetingName( event ) {
    this.setState({
      ...this.state,
      name: event.target.value
    });
  }

  setMeetingDate( event ) {
    this.setState({
      ...this.state,
      date: event.target.value
    });
  }

  saveMeeting() {
    this.props.store.dispatch(
      saveMeeting({
        name: this.state.name,
        date: this.state.date,
        owner_id: this.state.owner_id,
        topics: this.state.topics,
        participants: this.state.participants
      })
    );
  }

  render() {
    return (
      <div>
        <HeaderForm
          setMeetingName={this.setMeetingName}
          meetingName={this.state.meetingName}
          setMeetingDate={this.setMeetingDate}
          meetingDate={this.state.meetingDate}
        />
        <TopicsForm
          topics={this.state.topics}
          setTopics={this.setTopics}
        />
        <ParticipantsForm
          owner={this.state.ownerEmail}
          participants={this.state.participants}
          setParticipants={this.setParticipants}
        />
        <Button
          varient='secondary'
          className={styles.meetingButton}
          onClick={this.saveMeeting}
          text='submit'
        />
      </div>
    );
  }
}

export default Meeting;
