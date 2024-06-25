import { ApiResponse, getApiResponse, getSuccessData } from "../lib/api";

export const getList = async (kind?: "fruits" | "vegetables") => {
  const url = new URL("/api/list", window.location.origin);

  if (kind) {
    url.searchParams.set("kind", kind);
  }

  const response = await window.fetch(url);

  return getApiResponse<ApiResponse<{ id: number; name: string }[]>>()(
    response
  ).then(getSuccessData);
};
