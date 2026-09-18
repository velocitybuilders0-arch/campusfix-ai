class ApiError extends Error {
  constructor(message, details = null) {
    super(message);
    this.name = 'ApiError';
    this.details = details;
  }
}

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function request(path, options = {}) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  if (!baseUrl || !String(baseUrl).trim()) {
    throw new ApiError(
      'VITE_API_BASE_URL is not configured. Add frontend/.env with VITE_API_BASE_URL pointing to the backend.',
    );
  }

  const { method = 'GET', body, headers = {}, ...rest } = options;
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: isFormData ? { ...headers } : { 'Content-Type': 'application/json', ...headers },
    body: isFormData ? body : body != null ? JSON.stringify(body) : undefined,
    ...rest,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new ApiError(`Request failed: ${response.status} ${response.statusText}`, errorText);
  }

  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    return response.json();
  }

  return response.text();
}

export { ApiError, request };
export default request;
