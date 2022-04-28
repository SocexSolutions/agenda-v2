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
      const { data } = await client.post(
        'takeaway',
        takeaway
      );

      const takeaways = data.reduce(
        ( prev, cur ) => {
          prev[ cur._id ] = cur;
          return prev;
        },
        {}
      );

      dispatch({
        type: 'takeaway/save',
        payload: {
          takeaways
        }
      });
    } catch ( error ) {
      console.log( error );
    }
  };
};

export default reducer;
