import client from '../../client';

const initialState = {
  openMeeting: {},
  ownedMeetings: {},
  participantMeetings: {}
};

const reducer = ( state = initialState, action ) => {

  switch ( action.type ) {

    case 'meeting/fetch':
      return { ...state, openMeeting: action.payload };

    case 'meeting/save':
      return { ...state, openMeeting: action.payload };

    case 'meetings/getmeetings':
      return { ...state, ...action.payload };

    default:
      return state;
  }
};

/**
 * Retrieve a meeting
 * @param {Object} meeting_id - meeting id of meeting to fetch
 * @return {Promise<undefined>}
 */
export const fetchMeeting = ( meeting_id ) => {
  return async function fetchMeeting( dispatch, getState ) {
    try {
      const { data } = await client.get(
        `meeting/${ meeting_id }`
      );

      dispatch({
        type: 'meeting/fetch',
        payload: {
          ...data[ 0 ]
        }
      });
    } catch ( error ) {

      console.error( error.message );
    }
  };
};

export const saveMeeting = ( meeting ) => {
  return async function MeetingSave( dispatch, getState ) {

    try {

      meeting.topics       = Array.from( meeting.topics );
      meeting.participants = Array.from( meeting.participants );

      const { data } = await client.post(
        'meeting',
        meeting
      );

      dispatch({
        type: 'meeting/save',
        payload: {
          meeting
        }
      });

    } catch ( error ) {

      console.error( error.message );
    }
  };
};

export const getInbox = () => {
  return async function InboxGet( dispatch, getState ) {

    const state = getState();
    const email = state.user.email;
    const user_id = state.user._id;

    const participantRes = await client.get(
      `participant/meetings/${ email }`
    );

    let ownedRes = [];
    if ( user_id ) {
      ownedRes = await client.get(
        `user/meetings/${ user_id }`
      );
    }

    dispatch({
      type: 'meetings/getmeetings',
      payload: {
        ownedMeetings: ownedRes.data,
        participantMeetings: participantRes.data
      }
    });
  };
};

export default reducer;
