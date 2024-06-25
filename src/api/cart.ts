import { ApiResponse, getApiResponse, getSuccessData } from "../lib/api";

export const getCart = async () => {
  const response = await window.fetch("/api/cart");

  return getApiResponse<ApiResponse<{ id: number; name: string }[]>>()(
    response
  ).then(getSuccessData);
};

export const addToCart = async (id: number) => {
  const response = await window.fetch("/api/cart", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(id),
  });

  return getApiResponse<ApiResponse<{ id: number; name: string }[]>>()(
    response
  ).then(getSuccessData);
};
