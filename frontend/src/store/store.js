import { configureStore } from "@reduxjs/toolkit";

// Import counter reducer
import counterReducer from "../features/counter/counterSlice";

// Create the central Redux store
export const store = configureStore({

  // Register all reducers here
  reducer: {
    counter: counterReducer
  }

});

