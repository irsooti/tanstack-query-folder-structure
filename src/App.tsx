import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { RouterProvider } from "react-router-dom";
import { Cart } from "./Cart";
import { router } from "./routes";

function App() {
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { retry: false } } })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      <Cart />
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
