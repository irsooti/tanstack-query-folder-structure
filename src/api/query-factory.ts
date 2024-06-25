import { queryOptions } from "@tanstack/react-query";
import { getList } from "./list";
import { getCart } from "./cart";

export const createGroceryListqueryOptions = (kind?: "fruits" | "vegetables") =>
  queryOptions({
    queryKey: ["grocery-list", kind],
    queryFn: () => getList(kind),
  });

export const cartQueryOptions = queryOptions({
  queryKey: ["cart"],
  queryFn: getCart,
});
