import client from "../../client";

const initialState = {
  openMeeting: {},
  userMeetings: []
};

const reducer = ( state = initialState, action ) => {
  switch ( action.type ) {

  case "meeting/fetch":
    return { ...state, openMeeting: action.payload };

  default:
    return state;
  }
};

export const fetchMeeting = ( meeting_id ) => {
  return async function fetchMeeting( dispatch, getState ) {
    try {
      const { data } = await client.get( `meeting/${ meeting_id }` );

      dispatch(
        {
          type: "meeting/fetch",
          payload: {
            ...data
          }
        }
      );
    } catch ( error ) {

      console.error( error.message );
    }
  };
};

export default reducer;
