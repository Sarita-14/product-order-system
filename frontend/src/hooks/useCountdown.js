import { useState, useEffect } from "react";

function useCountdown(initialSeconds) {

  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {

    if (seconds <= 0) return;

    const interval = setInterval(() => {

      setSeconds((prev) => prev - 1);

    }, 1000);

    // Cleanup interval
    return () => clearInterval(interval);

  }, [seconds]);

  return seconds;
}

export default useCountdown;
