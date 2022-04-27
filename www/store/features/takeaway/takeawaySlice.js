import client from '../../client';

const initialState = {
  takeaway: {}
};

const reducer = ( state = initialState, action ) => {

  console.log( action );

  switch ( action.type ) {

    case 'takeaway/save':
      return { ...state, takeaway: action.payload };

    default:
      return state;
  }
};

export const saveTakeaway = ( takeaway ) => {
  return async function takeawaySave( dispatch, getState ) {
    console.log('hi');
    try {
      const res = await client.post(
        'takeaway',
        takeaway
      );

      dispatch({
        type: 'takeaway/save',
        payload: {
          takeaway
        }
      });
    } catch ( error ) {
      console.log( error );
    }
  };
};

export default reducer;
