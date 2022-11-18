const initialState = {
  open: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "ui/toggleDrawer":
      return { state, open: !state.open };

    default:
      return state;
  }
};

/**
 * Open or close the drawer
 */
export const toggleDrawer = () => {
  return function toggleDrawer(dispatch) {
    dispatch({ type: "ui/toggleDrawer", payload: {} });
  };
};
