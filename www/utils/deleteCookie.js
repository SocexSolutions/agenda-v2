export const deleteCookie = ( cookieName ) => {
  const cookie = document.cookie
    .match( new RegExp( "(^| )" + cookieName + "=([^;]+)" ) );

  if( cookie ) {
    document.cookie = `${cookie}; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
  }
};

