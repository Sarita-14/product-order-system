import { useSelector, useDispatch } from "react-redux";

// Import actions from counter slice
import { increment, decrement, reset } from "../features/counter/counterSlice";

function ReduxCounter() {

  // useSelector reads data from Redux store
  const count = useSelector((state) => state.counter.value);

  // useDispatch sends actions to Redux store
  const dispatch = useDispatch();

  return (
    <div className="redux-counter">

      <h2>Redux Counter</h2>

      <h3>Count: {count}</h3>

      {/* Dispatch increment action */}
      <button onClick={() => dispatch(increment())}>
        Increase
      </button>

      {/* Dispatch decrement action */}
      <button onClick={() => dispatch(decrement())}>
        Decrease
      </button>

      {/* Dispatch reset action */}
      <button onClick={() => dispatch(reset())}>
        Reset
      </button>

    </div>
  );
}

export default ReduxCounter;
