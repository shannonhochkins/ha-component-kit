import { useInternalStore } from "./HassContext";

export async function callApi<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<
  | {
      data: T;
      status: "success";
    }
  | {
      data: string;
      status: "error";
    }
> {
  try {
    const { connection, hassUrl } = useInternalStore.getState();
    const response = await fetch(`${hassUrl}/api${endpoint}`, {
      method: "GET",
      ...(options ?? {}),
      headers: {
        Authorization: "Bearer " + connection?.options.auth?.accessToken,
        "Content-type": "application/json;charset=UTF-8",
        ...(options?.headers ?? {}),
      },
    });
    if (response.status === 200) {
      const data = await response.json();
      return {
        status: "success",
        data,
      };
    }
    return {
      status: "error",
      data: response.statusText,
    };
  } catch (e) {
    console.error("API Error:", e);
    return {
      status: "error",
      data: `API Request failed for endpoint "${endpoint}", follow instructions here: https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-hooks-usehass-hass-callapi--docs.`,
    };
  }
}
