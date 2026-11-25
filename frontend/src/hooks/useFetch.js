
import { useState, useEffect } from "react";

function useFetch(url) {

  // Store API response
  const [data, setData] = useState(null);

  // Track loading status
  const [loading, setLoading] = useState(true);

  // Store error information
  const [error, setError] = useState(null);

  useEffect(() => {

    const fetchData = async () => {

      try {

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Network error");
        }

        const result = await response.json();

        setData(result);

      } catch (err) {

        setError(err.message);

      } finally {

        setLoading(false);

      }
    };

    fetchData();

  }, [url]);

  return { data, loading, error };
}

export default useFetch;
