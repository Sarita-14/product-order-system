
import { createSlice } from "@reduxjs/toolkit";

// Creating a counter slice
const counterSlice = createSlice({

  // Name of this slice
  name: "counter",

  // Initial state of counter
  initialState: {
    value: 0
  },

  // Reducers define how the state changes
  reducers: {

    // Increase counter by 1
    increment: (state) => {
      state.value += 1;
    },

    // Decrease counter by 1
    decrement: (state) => {
      state.value -= 1;
    },

    // Reset counter to 0
    reset: (state) => {
      state.value = 0;
    }
  }
});

// Export actions so components can dispatch them
export const { increment, decrement, reset } = counterSlice.actions;

// Export reducer so the store can use it
export default counterSlice.reducer;
