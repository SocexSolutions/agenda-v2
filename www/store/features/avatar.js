import client from "../../api/client";

const initialState = {
  initials: null,
  image: null,
  color: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "avatar/create":
      return {...action.payload} ;

    case "avatar/refresh":
      return {...action.payload} ;

    default:
      return state;
  }
};

export const createAvatar = () => {
  return async function avatarCreate(dispatch, getState) {
    const state = getState();
    const user_id = state.user._id;

    try {
      if (user_id) {
        const res = await client.post("/avatar", {});
        dispatch({ type: "avatar/create", payload: { ...res.data } });
      }
    } catch (err) {
      console.error(err);
    }
  };
};

export const refreshAvatar = () => {
  return async function avatarRefresh(dispatch, getState) {
    const state = getState();
    const user_id = state.user._id;

    try {
      if (user_id) {
        const res = await client.get("/avatar");

        dispatch({ type: "avatar/refresh", payload: { ...res.data } });
      }
    } catch (err) {
      console.error(err);
    }
  };
};
