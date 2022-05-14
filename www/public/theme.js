//super quick theme loader rather than in useEffect
( function initTheme() {
  const theme = localStorage.getItem('theme');
  if ( theme ) {
    document.querySelector('html').classList.add( theme );
  } else {
    document.querySelector('html').classList.add('default');
  }
})();
