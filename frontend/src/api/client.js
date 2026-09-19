import { supabase } from '../lib/supabase';

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
  let sessionData;

  try {
    sessionData = await supabase.auth.getSession();
  } catch (error) {
    throw new ApiError('Unable to verify your authentication session. Please sign in again.', error.message);
  }

  const { data, error } = sessionData;

  if (error) {
    throw new ApiError('Unable to verify your authentication session. Please sign in again.', error.message);
  }

  const accessToken = data.session?.access_token;

  if (!accessToken) {
    throw new ApiError('Authentication is required. Please sign in before making this request.');
  }

  let response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      method,
      headers: isFormData
        ? { ...headers, Authorization: `Bearer ${accessToken}` }
        : { 'Content-Type': 'application/json', ...headers, Authorization: `Bearer ${accessToken}` },
      body: isFormData ? body : body != null ? JSON.stringify(body) : undefined,
      ...rest,
    });
  } catch (networkError) {
    throw new ApiError(
      'Could not reach the CampusFix backend. It may be offline.',
      { cause: networkError },
    );
  }

  if (!response.ok) {
    const errorText = await response.text();

    if (response.status === 401) {
      await supabase.auth.signOut();
      throw new ApiError('Your session has expired. Please sign in again.', errorText);
    }

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
