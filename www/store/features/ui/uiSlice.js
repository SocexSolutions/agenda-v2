import client from '../../client';

const initialState = {
  drawerOpen: false,
  theme: 'default'
};

export default ( state = initialState, action ) => {

  switch ( action.type ) {

    case 'ui/toggleDrawer':
      return { state, drawerOpen: !state.drawerOpen };

    case 'ui/pickTheme':
      return { state, theme: action.payload };

    case 'ui/refreshTheme':
      return { state, theme: action.payload };

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

export const pickTheme = ( theme ) => {
  return async function themePick( dispatch, getState ) {
    const state = getState();
    const user_id = state.user._id;

    try {
      await client.post(
        '/ui',
        { theme, user_id }
      );

      dispatch({ type: 'ui/pickTheme', payload: { theme } });

      document.documentElement.setAttribute( 'data-theme', theme.theme );

    } catch ( err ) {
      console.log( err );
    }
  };
};

export const refreshTheme = () => {
  return async function themeRefresh( dispatch, getState ) {
    const token = sessionStorage.getItem('agenda-auth');
    const state = getState();
    const user_id = state.user._id;

    try {
      if ( user_id ) {
        const { data } = await client.get( `ui/${ user_id }`,
          {
            headers: { 'authorization': token }
          }
        );

        dispatch({ type: 'ui/refreshTheme', payload: { theme: data.theme } });
      }


    } catch ( err ) {
      console.log( err );
    }
  };


};

