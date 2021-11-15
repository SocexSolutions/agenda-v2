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

  case "user/logout":
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

      document.cookie = `auth-token=${data.token}`;

      dispatch(
        {
          type: "user/login",
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
            username: data.user.username,
            email:    data.user.email
          }
        }
      );
    } catch ( err ) {
      console.log( err );
    }
  };
};

export const userLogout = () => {
  return async function logoutUser( dispatch, getState ) {
    const cookie = document.cookie
      .match( new RegExp( "(^| )" + "auth-token" + "=([^;]+)" ) );

    if ( cookie ) {
      document.cookie = `${cookie}; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
    }

    history.push( "/home" );

    dispatch(
      {
        type: "user/logout",
        payload: {}
      }
    );
  };
};

export const getInbox = ( email ) => {
  return async function InboxGet( dispatch, getState ) {
    const { data } = await client.get(
      "participant/getmeetings",
      {
        params: {
          email: email
        }
      }
    );

    dispatch(
      {
        type: "user/getmeetings",
        payload: { userMeetings: data }
      }
    );
  };
};


export default reducer;
