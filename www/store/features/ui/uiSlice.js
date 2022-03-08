import client from '../../client';
import { changeTheme } from '../../../utils/theme';

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

    await client.post(
      '/ui',
      { theme, user_id }
    );

    dispatch({ type: 'ui/pickTheme', payload: { theme } });

    changeTheme( theme );
  };
};
