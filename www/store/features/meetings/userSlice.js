import client from "../../client";

const initialState = {};

const reducer = ( state = initialState, action ) => {
  switch ( action.type ) {

  case "meeting/fetch":
    return action.payload;
  }
};

export const fetchUserMeetings = () => {
  return async function fetchUserMeetings( dispatch, getState ) {
    try {
      const { data } = await client.get(
      )
    }
  }
}
