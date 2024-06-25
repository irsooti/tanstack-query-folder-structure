import {
  useMutation,
  useQueryClient,
  useQueryErrorResetBoundary,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  cartQueryOptions,
  createGroceryListqueryOptions,
} from "./api/query-factory";
import { PropsWithChildren } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { addToCart } from "./api/cart";
import { ApiError } from "./lib/api";
import { useSearchParams } from "react-router-dom";

type GroceryListItemProps = {
  id: number;
  name: string;
};

function GroceryListItem(props: GroceryListItemProps) {
  const url = new URL("https://placehold.co/600x400");
  url.searchParams.set("text", props.name);

  const cartMutation = useCartMutation();

  return (
    <div className="shadow-xl card card-compact bg-base-100 w-96">
      <figure>
        <img src={url.toString()} alt="" width={400} height={300} />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{props.name}</h2>
        <div className="justify-end card-actions">
          <button
            disabled={cartMutation.isPending}
            onClick={() => {
              cartMutation.mutate(props.id);
            }}
            className="btn btn-primary"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

export function GroceryList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const groceryListQuery = useSuspenseQuery(
    createGroceryListqueryOptions(
      searchParams.get("kind") as "fruits" | "vegetables" // TODO: fix this
    )
  );

  return (
    <>
      <div className="py-16 m-auto max-w-48">
        <div className="form-control">
          <label className="cursor-pointer label">
            <span className="label-text">
              {searchParams.get("kind") === "fruits" ? "Only fruits" : "All"}
            </span>
            <input
              type="checkbox"
              onChange={({ currentTarget }) => {
                currentTarget.checked
                  ? setSearchParams({ kind: "fruits" })
                  : setSearchParams((params) => {
                      params.delete("kind");

                      return params;
                    });
              }}
              className="toggle toggle-lg toggle-primary"
              defaultChecked
            />
          </label>
        </div>
      </div>
      <div className="grid gap-5 xl:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 justify-items-center">
        {groceryListQuery.data.map((item) => (
          <GroceryListItem key={item.id} name={item.name} id={item.id} />
        ))}
      </div>
    </>
  );
}

export function GroceryListErrorBoundary(props: PropsWithChildren) {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary
      onReset={reset}
      fallbackRender={({ resetErrorBoundary, error }) => {
        let message = "An error occurred";

        if (error instanceof ApiError) {
          message = error.message; // default message is "API Error"
        }

        return (
          <div className="text-center">
            <div className="pb-5 text-3xl">{message}</div>
            <div>
              <button
                onClick={() => resetErrorBoundary()}
                className="btn btn-lg btn-error"
              >
                Try again
              </button>
            </div>
          </div>
        );
      }}
    >
      {props.children}
    </ErrorBoundary>
  );
}

function useCartMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries(cartQueryOptions);
    },
  });
}
