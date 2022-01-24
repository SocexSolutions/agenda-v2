import { Component } from 'react';
import HeaderForm from '../../../components/Bundles/Meeting/HeaderForm';
import TopicsForm from '../../../components/Bundles/Meeting/TopicsForm';
import ParticipantsForm from '../../../components/Bundles/Meeting/ParticipantsForm';
import LoadingIcon from '../../../components/LoadingIcon';
import Button from '../../../components/Button';
import { saveMeeting, fetchMeeting } from '../../../store/features/meetings/meetingSlice';
import styles from '../../../styles/MeetingPage.module.css';

class Meeting extends Component {
  constructor( props ) {
    super( props );

    const state = this.props.store.getState();


    this.state = {
      ownerUsername: state.user.username,
      editing: true,
      loading: true,
      meeting: {
        name: '',
        date: new Date(),
        owner_id: state.user._id,
        topics: [],
        participants: []
      }
    };

    this.setParticipants = this.setParticipants.bind( this );
    this.setTopics = this.setTopics.bind( this );
    this.setMeetingName = this.setMeetingName.bind( this );
    this.setMeetingDate = this.setMeetingDate.bind( this );
    this.saveMeeting = this.saveMeeting.bind( this );
  }

  async componentDidMount() {
    const id = String( window.location.pathname ).split('/').at( -1 );

    if ( id.length === 24 ) {
      await this.props.store.dispatch(
        fetchMeeting( id )
      );

      const state = this.props.store.getState();

      this.setState({
        ...this.state,
        loading: false,
        meeting: {
          ...state.meetings.openMeeting
        }
      });
    }

    this.setState({ ...this.state, loading: false });
  }

  setTopics( topics ) {
    this.setState({
      ...this.state,
      meeting: {
        ...this.state.meeting,
        topics
      }
    });
  }

  setParticipants( participants ) {
    this.setState({
      ...this.state,
      meeting: {
        ...this.state.meeting,
        participants
      }
    });
  }

  setMeetingName( event ) {
    this.setState({
      ...this.state,
      meeting: {
        ...this.state.meeting,
        name: event.target.value
      }
    });
  }

  setMeetingDate( event ) {
    this.setState({
      ...this.state,
      meeting: {
        ...this.state.meeting,
        date: event.target.value
      }
    });
  }

  saveMeeting() {
    this.props.store.dispatch(
      saveMeeting({
        ...this.state.meeting
      })
    );
  }

  render() {
    if ( this.state.loading ) {
      return <LoadingIcon/>;
    }

    return (
      <div>
        <HeaderForm
          setMeetingName={this.setMeetingName}
          meetingName={this.state.meeting.name}
          setMeetingDate={this.setMeetingDate}
          meetingDate={this.state.meeting.date}
        />
        <TopicsForm
          topics={this.state.meeting.topics}
          setTopics={this.setTopics}
        />
        <ParticipantsForm
          owner={this.state.ownerUsername}
          participants={this.state.meeting.participants}
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
