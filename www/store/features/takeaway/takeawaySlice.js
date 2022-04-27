import client from '../../client';

const initialState = {
  takeaway: {}
};

const reducer = ( state = initialState, action ) => {

  switch ( action.type ) {

    case 'takeaway/save':
      return { ...state, takeaway: action.payload };

    default:
      return state;
  }
};

export const saveTakeaway = ( takeaway ) => {
  return async function TakeawaySave( dispatch, getState ) {
    await client.post(
      'takeaway',
      takeaway
    );

    dispatch({
      type: 'takeaway/save',
      payload: {
        takeaway
      }
    });

  };
};

export default reducer;
