initialState = {
  user: {
    jwt: null,
    username: null,
    email: null
  }
}

const reducer = ( state = initialState ) {
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

export const userLogin = ( username, password ) => {
  return {
    type: 'user/login',
    payload: { 
      username,
      password
    }
  }
}