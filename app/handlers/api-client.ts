

interface ApiClientInterface  {
    url: string;
    options: Omit<RequestInit, "body"> & { body?: BodyInit | object | null };
    headers?: HeadersInit;
}

export const apiClient = async ({ url, headers, options }: ApiClientInterface) => {

    const serializedBody =
    options.body && typeof options.body === "object"
      ? JSON.stringify(options.body)
      : options.body;

    try {
      const response = await fetch(`${url}`, {
        headers: new Headers({
          ...headers,
          "Content-Type": "application/json",
        }),
        ...options,
        body: serializedBody,
      });

      const data = await response.json();

      if (!response.ok) {
          const error = new Error("API Error");
          (error as any).errors = data.errors;
          throw error;
      }

      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
