import {
    useQueryErrorResetBoundary,
    useSuspenseQuery
} from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { cartQueryOptions } from "./api/query-factory";

export function Cart() {
  return (
    <div className="absolute right-10 top-5 bg-primary text-primary-content px-8 rounded-full py-5">
      <CartErrorBoundary>
        Element in the cart:{" "}
        <Suspense
          fallback={
            <span className="inline-block skeleton align-sub h-5 w-3" />
          }
        >
          <CartElements />
        </Suspense>
      </CartErrorBoundary>
    </div>
  );
}

export function CartElements() {
  // className="skeleton h-32 w-32"
  const cartQuery = useSuspenseQuery(cartQueryOptions);

  return <span className="font-black">{cartQuery.data.length}</span>;
}

function CartErrorBoundary(props: { children: React.ReactNode }) {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary
      children={props.children}
      onReset={reset}
      fallbackRender={({ resetErrorBoundary }) => {
        return (
          <span className="font-black">
            <button
              onClick={resetErrorBoundary}
              className="btn btn-xs btn-error btn-ghost"
            >
              Error occurred, try again
            </button>
          </span>
        );
      }}
    />
  );
}
