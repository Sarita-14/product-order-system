import { useRef } from "react";

function ThrottleDemo() {

  const lastClick = useRef(0); //Stores the time of the previous accepted click

  const handleClick = () => {

    const now = Date.now();

    if (now - lastClick.current < 1000) { //Checks whether less than one second has passed since the previous accepted click.
      console.log("Please wait!");
      return;
    }

    lastClick.current = now;

    console.log("Button clicked successfully!");

  };

  return (
    <div>

      <h2>Throttling Example</h2>

      <button onClick={handleClick}>
        Click Me
      </button>

    </div>
  );
}

export default ThrottleDemo;