
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from './App.jsx';
import { store } from "./store/store";
import './index.css';

// Create a central QueryClient to manage API data and caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // Data stays fresh for 30 seconds
      gcTime: 5 * 60 * 1000, // Keep inactive cache for 5 minutes
      retry: 1, // Retry a failed request once
      refetchOnWindowFocus: true, // Refetch stale data when user returns to the tab
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>

    {/* Provider makes Redux store available to all components */}
    <Provider store={store}>

      {/* QueryClientProvider makes React Query available to all components */}
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>

    </Provider>

  </StrictMode>
);
