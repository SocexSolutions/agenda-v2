/**
 * Parse a document.cookie for the given key
 * @param {string} key - key to search for
 * @return {string} - value of (if any) for given key in cookie
 */
function getCookie(key) {
  const pair = document.cookie.split("; ").filter((str) => {
    return key === str.split("=")[0];
  });

  if (pair.length) {
    return pair[0].split("=")[1];
  }
}

/**
 * Set a cookie with the given key, value (expires in 1 day)
 * @param {string} key - key for cookie
 * @param {string} value - value of cookie
 */
function setCookie(key, value) {
  const oneDayMs = 1000 * 60 * 60 * 24;
  const utcDate = new Date(Date.now() + oneDayMs).toUTCString();

  const expires = "expires=" + utcDate;
  const path = "path=/";

  document.cookie = key + "=" + value + "; " + expires + "; " + path;
}

/**
 * Set a cookie to expire immediately (essentially deleting it)
 * @param {string} key - key for cookie to expire
 */
function deleteCookie(key) {
  const cookie = document.cookie.match(new RegExp("(^| )" + key + "=([^;]+)"));

  if (cookie) {
    document.cookie = `${cookie}; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
  }
}

export { getCookie, setCookie, deleteCookie };
