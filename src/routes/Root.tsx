import { Suspense } from "react";
import { GroceryList, GroceryListErrorBoundary } from "../GroceryList";
import { Hero } from "../Hero";

export default function Root() {
  return (
    <div>
      <Hero />
      <Suspense
        fallback={
          <div className="text-center">
            <span className="loading loading-bars loading-lg"></span>
          </div>
        }
      >
        <GroceryListErrorBoundary>
          <GroceryList />
        </GroceryListErrorBoundary>
      </Suspense>
    </div>
  );
}
