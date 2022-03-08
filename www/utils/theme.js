export const changeTheme = ( theme ) => {
  if ( 'default' ) {
    window.sessionStorage.removeItem('agenda-theme');
  }
  window.sessionStorage.setItem( 'agenda-theme', theme );
  document.documentElement.setAttribute( 'data-theme', theme );
};


