import client from '../../client';

const initialState = {
  topics: { }
};

const reducer = ( state = initialState, action ) => {
  switch ( action.type ) {

    case 'topic/fetchTopics':
      return { ...action.payload };

    case 'topic/updateStatus':
      return { ...action.payload };

    default:
      return state;
  }
};

/**
 * Fetch topics
 * @param {Object} meeting_id - query params
 * @return {Promise<undefined>}
 */
export const fetchMeetingTopics = ( meeting_id ) => {
  return async function fetchTopics( dispatch, getState ) {
    try {
      const { data } = await client.get( `/meeting/${ meeting_id }/topics` );

      const currentTopics = getState().topics;

      currentTopics[ data._id ] = data;

      dispatch({
        type: 'topic/updateStatus',
        payload: {
          topics: currentTopics
        }
      });
    } catch ( err ) {}
  };
};

/**
 * Set topic status
 * @param {Object} topic_id - id of the topic to update
 * @return {Promise<undefined>}
 */
export const updateTopicStatus = ( topic_id, status ) => {
  return async function updateTopicStatus( dispatch, getState ) {
    try {
      const { data } = await client.patch(
        `/topic/${ topic_id }/status`,
        { status }
      );

      const currentTopics = getState().topics;

      currentTopics[ data._id ] = data;

      dispatch({
        type: 'topic/updateStatus',
        payload: {
          topics: currentTopics
        }
      });
    } catch ( err ) {}
  };
};

export default reducer;
