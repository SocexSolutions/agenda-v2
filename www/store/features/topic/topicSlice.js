import client from '../../client';

const initialState = {
  likes: []
};

export default ( state = initialState, action ) => {
  switch ( action.type ) {

    case 'topic/like':
      return { state, topic: action.payload };
  }
};
