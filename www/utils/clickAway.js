import { useEffect } from 'react';

function useClickAway( ref, cb ) {
  useEffect( () => {
    function handleClickAway( event ) {
      if ( ref.current && !ref.current.contains( event.target ) ) {
        cb();
      }
    }

    document.addEventListener( 'mousedown', handleClickAway );
    return () => {
      document.removeEventListener( 'mousedown', handleClickAway );
    };
  }, [ ref, cb ] );
}

export default useClickAway;
