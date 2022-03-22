import client from '../../client';
import { getCookie, deleteCookie, setCookie } from '../../../utils/cookie';

const initialState = {
  token: null,
  _id: null,
  username: null,
  email: null
};

const reducer = ( state = initialState, action ) => {
  switch ( action.type ) {

    case 'user/register':
      return action.payload;

    case 'user/login':
      return action.payload;

    case 'user/refresh':
      return action.payload;

    case 'user/logout':
      return action.payload;

    default:
      return state;
  }
};

/**
 * Register a new user
 * @param {string} props.email - email address
 * @param {string} props.username - user's username
 * @param {string} props.password - user's password
 * @returns {Promise<undefined>}
 */
export const userRegister = ({ email, username, password }) => {
  return async function registerUser( dispatch, getState ) { // eslint-disable-line
    const { data } = await client.post(
      '/user/register',
      {
        email,
        username,
        password
      }
    );

    setCookie( 'agenda-auth', data.token );

    dispatch({
      type: 'user/register',
      payload: {
        token:    data.token,
        _id:      data.user._id,
        username: data.user.username,
        email:    data.user.email
      }
    });
  };
};

/**
 * Login an existing user
 * @param {string} props.username - user's username
 * @param {string} props.password - user's password
 * @returns {Promise<undefined>}
 */
export const userLogin = ({ username, password }) => {
  return async function loginUser( dispatch, getState ) { // eslint-disable-line
    const { data } = await client.post(
      '/user/login',
      {
        username,
        password
      }
    );

    setCookie( 'agenda-auth', data.token );

    dispatch({
      type: 'user/login',
      payload: {
        token:    data.token,
        _id:      data.user._id,
        username: data.user.username,
        email:    data.user.email
      }
    });
  };
};

/**
 * Refresh the user state based on auth token
 * @returns {Promise<undefined>}
 */
export const userRefresh = () => {
  return async function refreshUser( dispatch, getState ) { // eslint-disable-line
    const token = getCookie('agenda-auth');

    if ( token ) {
      try {
        const { data } = await client.get(
          'user/refresh',
          {
            headers: { 'authorization': token }
          }
        );

        dispatch({
          type: 'user/refresh',
          payload: {
            token:    data.token,
            _id:      data.user._id,
            username: data.user.username,
            email:    data.user.email
          }
        });

      } catch ( err ) {
        console.error( err );
      }
    }
  };
};

/**
 * Logout a the user, invalidating the cookie and clearing the user state
 * @returns {Promise<undefined>}
 */
export const userLogout = () => {
  return async function logoutUser( dispatch, getState ) { // eslint-disable-line
    deleteCookie('agenda-auth');

    window.location.href = '/';

    dispatch({
      type: 'user/logout',
      payload: {}
    });
  };
};

export default reducer;
