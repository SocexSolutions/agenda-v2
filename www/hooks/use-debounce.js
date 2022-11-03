import { useEffect, useState } from "react";

export default function useDebounce(value, delay) {
  const [val, setVal] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setVal(value), delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return val;
}
