
import { useState, useEffect } from "react";

function useWindowSize() {

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {

    const handleResize = () => {

      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });

    };

    // Listen for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);
    };

  }, []);

  return windowSize;
}

export default useWindowSize;
