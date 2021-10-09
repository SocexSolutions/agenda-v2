import client from "../../client";

const initialState = {
  token: null,
  _id: null,
  username: null,
  email: null
};

const reducer = ( state = initialState, action ) => {
  switch( action.type ) {

  case "user/register":
    return action.payload;

  case "user/login":
    return action.payload;

  case "user/refresh":
    return action.payload;

  default:
    return state;
  }
};

export const userRegister = ( email, username, password ) => {
  return async function registerUser( dispatch, getState ) {
    try {

      const { data } = await client.post(
        "/user/register",
        {
          email,
          username,
          password
        }
      );


      document.cookie = `auth-token=${data.token}`;

      dispatch(
        {
          type: "user/register",
          payload: {
            token:    data.token,
            _id:      data.user._id,
            username: data.user.username,
            email:    data.user.email
          }
        }
      );
    } catch ( error ) {

      console.error( error.message );
    }
  };
};

export const userLogin = ( username, password ) => {
  return async function loginUser( dispatch, getState ) {
    try {

      const { data } = await client.post(
        "/user/login",
        {
          username,
          password
        }
      );

      // set the token in the browser local storage
      document.cookie = `auth-token=${data.token}`;

      dispatch(
        {
          type: "user/login",
          payload: {
            token:    data.token,
            _id:      data.user._id,
            username: data.user.username
          }
        }
      );
    } catch ( error ) {

      console.error( error.message );
    }
  };
};

export const userRefresh = ( token ) => {
  return async function refreshUser( dispatch, getState ) {
    try {
       const { data } = await client.get(
        "user/refresh",
        {
          headers: { "authorization": token }
        }
      );

      dispatch(
        {
          type: "user/refresh",
          payload: {
            token:    data.token,
            _id:      data.user._id,
            username: data.user.username
          }
        }
      );
    } catch ( err ) {
      console.log( err );
    }
  };
};



export default reducer;
