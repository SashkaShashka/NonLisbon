const apiHost = "https://localhost:5001/api/";

const getApiUrl = (path) => new URL(path, apiHost).href;

function createHttpRequest(path, method = "GET", body) {
  const url = getApiUrl(path);
  const headers = new Headers();
  if (!(body instanceof FormData) && typeof body !== "string") {
    headers.append("Content-Type", "application/json;charset=utf-8");
    body = JSON.stringify(body);
  }
  return new Request(url, {
    method,
    headers,
    body,
  });
}

export class HttpStatusError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export async function apiRequest(path, method = "GET", body) {
  const response = await fetch(createHttpRequest(path, method, body));
  if (!response.ok) {
    const errorMessage = (await response.text()) || response.statusText;
    console.error(errorMessage);
    throw new HttpStatusError(errorMessage, response.status);
  }
  try {
    return await response.json();
  } catch {
    return null;
  }
}

const apiMethods = {
  get: (path) => apiRequest(path, "GET"),
  post: (path, body) => apiRequest(path, "POST", body),
  put: (path, body) => apiRequest(path, "PUT", body),
  delete: (path) => apiRequest(path, "DELETE"),
};

export default apiMethods;
