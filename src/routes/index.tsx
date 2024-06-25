import { createBrowserRouter } from "react-router-dom";
import Root from "./Root";

export const router = createBrowserRouter([
  {
    path: "/",
    errorElement: (
      <div className="flex items-center justify-center min-h-screen text-center">
        <div className="text-5xl font-bold">404, not found!</div>
      </div>
    ),
    Component: Root,
  },
]);
