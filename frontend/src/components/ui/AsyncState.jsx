// Shows "Loading…" or an error with a Retry button; otherwise renders children.
// Pair it with useApi(): <AsyncState {...query}>…</AsyncState>
import Alert from "./Alert";

function AsyncState({ loading, error, reload, children }) {
  if (loading) return <p className="muted center">Loading…</p>;

  if (error) {
    return (
      <Alert>
        {error}{" "}
        {reload && (
          <button type="button" className="btn btn-link" onClick={reload}>
            Retry
          </button>
        )}
      </Alert>
    );
  }

  return children;
}

export default AsyncState;
