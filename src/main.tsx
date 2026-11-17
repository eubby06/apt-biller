import React from "react";
import "./index.css";
import App from "./App.tsx";
import ReactDOM from "react-dom/client";

// 1. Import the required TanStack modules
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// 2. Create a client instance
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* 3. Wrap your app with the provider */}
    <QueryClientProvider client={queryClient}>
      <App />

      {/* 4. Optional: Add the DevTools panel (hidden in production automatically) */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
);
