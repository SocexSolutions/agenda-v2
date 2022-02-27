

const initialState = {
  drawerOpen: false
};

export default ( state = initialState, action ) => {

  switch ( action.type ) {

    case 'ui/toggleDrawer':
      return { state, drawerOpen: !state.drawerOpen };

    default:
      return state;
  }
};

/**
 * Open or close the drawer
 */
export const toggleDrawer = () => {
  return function toggleDrawer( dispatch, getState ) {
    dispatch({ type: 'ui/toggleDrawer', payload: {} });
  };
};
