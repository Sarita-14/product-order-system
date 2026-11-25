
import { useState, useReducer, useMemo } from "react";

function counterReducer(state, action) {
  switch (action.type) {
    case "increase":
      return { count: state.count + 1 };

    case "decrease":
      return { count: state.count - 1 };

    case "reset":
      return { count: 0 };

    default:
      return state;
  }
}

function StateManagement() {

  // useState: simple local state
  const [price, setPrice] = useState(100);

  const [discount, setDiscount] = useState(10);

  // useReducer: multiple counter actions
  const [counter, dispatch] = useReducer(
    counterReducer,
    { count: 0 }
  );

  // Derived state using useMemo
  const finalPrice = useMemo(() => {
    return price - (price * discount) / 100;
  }, [price, discount]);

  return (
    <div className="state-container">

      <h1>React State Management</h1>

      {/* useReducer example */}
      <h2>Counter: {counter.count}</h2>

      <button onClick={() => dispatch({ type: "increase" })}>
        Increase
      </button>

      <button onClick={() => dispatch({ type: "decrease" })}>
        Decrease
      </button>

      <button onClick={() => dispatch({ type: "reset" })}>
        Reset
      </button>

      <hr />

      {/* useState and derived state example */}
      <h2>Product Price</h2>

      <p>Original Price: ₹{price}</p>
      <p>Discount: {discount}%</p>
      <h3>Final Price: ₹{finalPrice}</h3>

      <button onClick={() => setPrice((prev) => prev + 100)}>
        Increase Price
      </button>

      <button onClick={() => setDiscount((prev) => prev + 5)}>
        Increase Discount
      </button>

    </div>
  );
}

export default StateManagement;
