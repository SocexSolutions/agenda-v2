/**
 * Parse a document.cookie for the given key
 * @param {string} cookie - document.cookie
 * @param {string} key - key to search for
 * @return {string} - value of (if any) for given key in cookie
 */
function parseCooke( cookie, key ) {
  const pair = cookie.split('; ').filter( str => {
    return key === str.split('=')[ 0 ];
  });

  if ( pair.length ) {
    return pair[ 0 ].split('=')[ 1 ];
  }
}

export default parseCooke;
