import client from "../../api/client";
import router from "next/router";

const initialState = {
  _id: null,
  username: null,
  email: null,
  loggedOut: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
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

/**
 * Register a new user
 * @param {string} props.email - email address
 * @param {string} props.username - user's username
 * @param {string} props.password - user's password
 * @returns {Promise<undefined>}
 */
export const userRegister = ({ email, username, password }) => {
  return async function registerUser(dispatch) {
    const { data } = await client.post("/user/register", {
      email,
      username,
      password,
    });

    dispatch({
      type: "user/register",
      payload: {
        _id: data.user._id,
        username: data.user.username,
        email: data.user.email,
      },
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
  return async function loginUser(dispatch) {
    const { data } = await client.post("/user/login", {
      username,
      password,
    });

    dispatch({
      type: "user/login",
      payload: {
        _id: data.user._id,
        username: data.user.username,
        email: data.user.email,
      },
    });
  };
};

/**
 * Refresh the user state based on auth cookie
 * @returns {Promise<undefined>}
 */
export const userRefresh = () => {
  return async function refreshUser(dispatch) {
    try {
      const { data } = await client.get("user/refresh");

      dispatch({
        type: "user/refresh",
        payload: {
          _id: data.user._id,
          username: data.user.username,
          email: data.user.email,
        },
      });
    } catch (err) {
      console.error(err);
    }
  };
};

/**
 * Logout a the user, invalidating the cookie and clearing the user state
 * @returns {Promise<undefined>}
 */
export const userLogout = () => {
  return async function logoutUser(dispatch) {
    await client.get("user/logout");

    dispatch({
      type: "user/logout",
      payload: { loggedOut: true },
    });

    router.push("/");
  };
};

/**
 * Select the user from the store
 */
export const selectUser = (state) => {
  return state.user;
};

export default reducer;
