// * Types

type ApiResponseShape = {
  status: "error" | "success";
};

export type ApiResponseSuccess<T> = ApiResponseShape & {
  status: "success";
  data: T;
};

export type ApiResponseErrorShape<T = string> = ApiResponseShape & {
  status: "error";
  data: T;
};

export type ApiResponseBaseError = {
  error: string;
  code: string;
  message?: string;
};

export type WithPagination<T> = {
  totalResults: number;
  pagination: {
    results: number;
    page: number;
  };
  list: T[];
};

// * Functions

/**
 * @description
 * This type is used to define the shape of the response of the API.
 * It can be used to define the shape of the response of a single API call or to define the shape of the response of a generic API call.
 * - The first generic (`T`) parameter is the shape of the data returned by the API.
 * - The second generic (`K`) parameter is the shape of the error data returned by the API. It is optional and it defaults to `unknown`.
 */
export type ApiResponse<T, K = unknown> =
  | ApiResponseErrorShape<K & ApiResponseBaseError>
  | ApiResponseSuccess<T>;

export function isApiSuccess<T>(
  data: ApiResponse<T>
): data is ApiResponseSuccess<T> {
  return data.status === "success";
}

export function isApiError<T>(
  data: ApiResponse<T>
): data is ApiResponseErrorShape<T & ApiResponseBaseError> {
  return data.status === "error";
}

function appendIfNotNullOrUndefined(
  searchParams: URLSearchParams,
  item: { key: string; value: unknown }
) {
  if (item.value === null || item.value === undefined) {
    return;
  }

  searchParams.append(item.key, item.value as string);
}

/**
 *
 * @param iterable  The iterable to which the record will be appended.
 * @param record The record to be appended to the iterable.
 */
function recursivelyAppend(
  iterable: URLSearchParams | FormData,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  record: { key: string; value: any }
) {
  if (typeof record.value === "object") {
    Object.entries(record.value).forEach(([nestedKey, nestedValue]) => {
      recursivelyAppend(iterable, {
        key: `${record.key}[${nestedKey}]`,
        value: nestedValue,
      });
    });

    return;
  }

  iterable.append(record.key, record.value);
}

/**
 * Adds search parameters to a URL and returns the modified URL.
 *
 * @param url - The URL to which search parameters will be added.
 * @param params - An object containing the search parameters to be added.
 * @returns The modified URL with the added search parameters.
 */
export function withSearchParams<
  T extends {
    [key: string]: string | number | string[] | number[] | null | undefined;
  }
>(url: string, params?: T): string {
  const searchParams = new URLSearchParams();
  let search = "";

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) =>
          appendIfNotNullOrUndefined(searchParams, { key, value: item })
        );
        return;
      }

      appendIfNotNullOrUndefined(searchParams, { key, value });
    });
  }

  search = searchParams.toString();

  return `${url}${search ? `?${search}` : ""}`;
}

/**
 * Converts an object to FormData.
 *
 * @param data - The data to be converted to FormData.
 * @returns The FormData object containing the data.
 */
export function withFormData<T extends { [key: string]: unknown }>(
  data: T
): FormData {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) =>
    recursivelyAppend(formData, { key, value })
  );

  return formData;
}

/**
 * Converts an object to adhere to x-www-form-urlencoded.
 * Why? Sometimes we need to send data as application/x-www-form-urlencoded instead of multipart/form-data.
 *
 * @param data - The data to be converted to UrlSearchParams.
 * @returns The UrlSearchParams object containing the data.
 */
export function withFormUrlEncodedData<T extends { [key: string]: unknown }>(
  data: T
) {
  const urlEncoded = new URLSearchParams();

  Object.entries(data).forEach(([key, value]) =>
    recursivelyAppend(urlEncoded, { key, value })
  );

  return urlEncoded;
}

/**
 * Converts a fetch response to an {@link ApiResponse}.
 *
 * @description This function is used to convert a fetch Response to an ApiResponse object.
 * An api response could be a success or an error, so it is up to you check the status of the response.
 * You can use the {@link isApiSuccess} and {@link isApiError} typeguard functions to check the status of the response.
 *
 * @param response - The fetch response to be converted.
 * @returns The ApiResponse callback object.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getApiResponse<T extends ApiResponse<any, any>>() {
  return async function apiResponseCallback(response: Response) {
    const apiResponse = (await response.json()) as T;

    if ("status" in apiResponse && "data" in apiResponse) {
      return apiResponse as T;
    }

    throw new NotStandardApiResponseError(response);
  };
}

// * Errors

/**
 * Extracts the data from an {@link ApiResponse} object.
 * Warning: This function will throw an error if the response is an error, so make sure to handle the error
 * @param apiResponse
 * @returns
 */
export function getSuccessData<T>(apiResponse: ApiResponse<T>) {
  if (isApiSuccess(apiResponse)) {
    return apiResponse.data;
  }

  throw new ApiError(apiResponse.data);
}

export class NotStandardApiResponseError extends Error {
  constructor(public response: Response) {
    super("The response is not a standard API response");
  }
}

export class ApiError<T> extends Error {
  constructor(
    public data: T extends ApiResponseErrorShape<infer U>
      ? U
      : ApiResponseBaseError
  ) {
    super("API error");
    this.data = data;
  }
}
