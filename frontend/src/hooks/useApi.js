// Loads data from an async function and tracks loading / error state.
// Different from useFetch.js (which fetches a raw URL once): this one takes
// any API call (already unwrapped by api/client.js) and can be reloaded
// after a create/update/delete.
//
// Pass a STABLE function (module-level, or wrapped in useCallback),
// otherwise it would refetch on every render.
import { useCallback, useEffect, useState } from "react";

function useApi(loader) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const [version, setVersion] = useState(0); // bump to reload

  useEffect(() => {
    let active = true; // ignore results if the component unmounted meanwhile

    loader()
      .then((data) => active && setState({ data, loading: false, error: null }))
      .catch((err) => active && setState({ data: null, loading: false, error: err.message }));

    return () => {
      active = false;
    };
  }, [loader, version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);

  return { ...state, reload };
}

export default useApi;
