import client from '../../client';

const initialState = {
  theme: 'default'
};

export default ( state = initialState, action ) => {

  switch ( action.type ) {
    case 'ui/pickTheme':
      return { state, theme: action.payload };

    case 'ui/refreshTheme':
      return { state, theme: action.payload };

    default:
      return state;
  }
};

export const pickTheme = ( theme ) => {
  return async function themePick( dispatch, getState ) {
    const state = getState();
    const user_id = state.user._id;

    window.localStorage.setItem( 'theme', theme );

    try {
      await client.post(
        '/ui',
        { theme, user_id }
      );

      dispatch({ type: 'ui/pickTheme', payload: { theme } });

    } catch ( err ) {}
  };
};

export const refreshTheme = () => {
  return async function themeRefresh( dispatch, getState ) {
    const state   = getState();
    const user_id = state.user._id;

    try {
      if ( user_id ) {
        const { data } = await client.get( `ui/${ user_id }` );

        dispatch({ type: 'ui/refreshTheme', payload: { theme: data.theme } });
      }

    } catch ( err ) {}
  };
};
