const initialState = {
  user: {
    jwt: null,
    username: null,
    email: null
  }
}

const reducer = ( state = initialState, action ) => {
  switch( action.type ) {

    case 'user/login':
      const jwt = 'jwt';
      const username = 'username';
      const email = 'email';

      return {
        ...state,
        jwt,
        username,
        email
      }

    default:
      return state;
  }
}

const userLogin = ( username, password ) => {
  return {
    type: 'user/login',
    payload: { 
      username,
      password
    }
  }
}

export default reducer;